import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { router } from "../../initTRPC"
import { db } from "../../lib/db"
import { teacherProcedure } from "../../procedures"
import type { PassType, PassStatusType } from "../shared/passType"

const passRouter = router({
	leavingPassTimeline: teacherProcedure.query(async ({ ctx: { email, schoolId } }) => {
		return await db.execute<Omit<PassType, "leavingEmail" | "leavingName">>(
			"SELECT scheduled_for, id, status, student_email, student_name, visiting_email, visiting_name, reason, teacher_comment, requested_at, left_at, arrived_at FROM pass_by_leaving_email WHERE leaving_email = ? AND school_id = ?",
			[email, schoolId]
		)
	}),
	visitingPassTimeline: teacherProcedure.query(async ({ ctx: { email, schoolId } }) => {
		return await db.execute<Omit<PassType, "visitingEmail" | "visitingName">>(
			"SELECT scheduled_for, id, status, student_email, student_name, leaving_email, leaving_name, reason, teacher_comment, requested_at, left_at, arrived_at FROM pass_by_visiting_email WHERE visiting_email = ? AND school_id = ?",
			[email, schoolId]
		)
	}),
	approvePass: teacherProcedure
		.input(
			z.object({
				passScheduledFor: z.date(),
				passId: z.string(),
				comment: z.string().optional(),
			})
		)
		.mutation(async ({ input: { passScheduledFor, passId, comment }, ctx: { schoolId } }) => {
			const status: PassStatusType = "approved"

			await db.execute(
				`UPDATE pass SET status = ?${
					comment !== undefined ? ", teacher_comment = ?" : ""
				} WHERE school_id = ? AND scheduled_for = ? AND id = ?`,
				comment !== undefined
					? [status, comment, schoolId, passScheduledFor, passId]
					: [status, schoolId, passScheduledFor, passId]
			)
		}),
	denyPass: teacherProcedure
		.input(
			z.object({
				passScheduledFor: z.date(),
				passId: z.string(),
				comment: z.string().optional(),
			})
		)
		.mutation(async ({ input: { passScheduledFor, passId, comment }, ctx: { schoolId } }) => {
			const status: PassStatusType = "denied"

			await db.execute(
				`UPDATE pass SET status = ?${
					comment !== undefined ? ", teacher_comment = ?" : ""
				} WHERE school_id = ? AND scheduled_for = ? AND id = ?`,
				comment !== undefined
					? [status, comment, schoolId, passScheduledFor, passId]
					: [status, schoolId, passScheduledFor, passId]
			)
		}),
	acknowledgeLeft: teacherProcedure
		.input(
			z.object({
				passScheduledFor: z.date(),
				passId: z.string(),
			})
		)
		.mutation(async ({ input: { passScheduledFor, passId }, ctx: { schoolId } }) => {
			const status: PassStatusType = "left"

			await db.execute(
				`UPDATE pass SET status = ?, left_at = currentTimestamp() WHERE school_id = ? AND scheduled_for = ? AND id = ?`,
				[status, schoolId, passScheduledFor, passId]
			)
		}),
	acknowledgeArrived: teacherProcedure
		.input(
			z.object({
				passScheduledFor: z.date(),
				passId: z.string(),
			})
		)
		.mutation(async ({ input: { passScheduledFor, passId }, ctx: { schoolId } }) => {
			const status: PassStatusType = "arrived"

			await db.execute(
				`UPDATE pass SET status = ?, arrived_at = currentTimestamp() WHERE school_id = ? AND scheduled_for = ? AND id = ?`,
				[status, schoolId, passScheduledFor, passId]
			)
		}),
})

export default passRouter
