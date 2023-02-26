import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { router } from "../../initTRPC"
import { db } from "../../lib/db"
import { studentProcedure } from "../../procedures"
import type { PassType, PassStatusType } from "../shared/passType"

const passRouter = router({
	passTimeline: studentProcedure.query(async ({ ctx: { email, schoolId } }) => {
		const a = await db.execute<
			Omit<
				PassType,
				| "studentEmail"
				| "studentName"
				| "leavingEmail"
				| "leavingName"
				| "requestedAt"
				| "arrivedAt"
				| "leftAt"
			>
		>(
			"SELECT scheduled_for, id, status, visiting_email, visiting_name, reason, teacher_comment FROM pass_by_student_email WHERE student_email = ? AND school_id = ?",
			[email, schoolId]
		)
		console.log({ a: a.length })
		return a
	}),
	requestPass: studentProcedure
		.input(
			z.object({
				scheduledFor: z.date(),
				visitingEmail: z.string(),
				reason: z.string().optional().default("No reason provided"),
			})
		)
		.mutation(
			async ({
				input: { scheduledFor, visitingEmail, reason },
				ctx: { email, name, schoolId, teacherEmail },
			}) => {
				const [leaving, visiting] = await db.execute<{
					name: string
				}>("SELECT name FROM teacher WHERE email IN (?, ?) AND school_id = ?", [
					teacherEmail,
					visitingEmail,
					schoolId,
				])

				if (leaving === undefined || visiting === undefined)
					throw new TRPCError({ code: "NOT_FOUND" })

				const status: PassStatusType = "pending"

				await db.execute(
					"INSERT INTO pass (school_id, scheduled_for, id, leaving_email, leaving_name, visiting_email, visiting_name, student_email, student_name, requested_at, reason, status) VALUES (?, ?, uuid(), ?, ?, ?, ?, ?, ?, currentTimestamp(), ?, ?)",
					[
						schoolId,
						scheduledFor,
						teacherEmail,
						leaving.name,
						visitingEmail,
						visiting.name,
						email,
						name,
						reason,
						status,
					]
				)
			}
		),
	getTeachersAtSchool: studentProcedure.query(async ({ ctx: { schoolId } }) => {
		return await db.execute<{ email: string; name: string }>(
			"SELECT email, name FROM teacher WHERE school_id = ?",
			[schoolId]
		)
	}),
})

export default passRouter
