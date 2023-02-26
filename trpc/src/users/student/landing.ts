import { router } from "../../initTRPC"
import { publicProcedure } from "../../procedures"
import { z } from "zod"
import { db } from "../../lib/db"
import getEmailFromGoogleOauthAccessToken from "../shared/auth/getEmailFromGoogleOauthAccessToken"
import { TRPCError } from "@trpc/server"
import {
	decodeAccountCreationToken,
	encodeAccessToken,
	encodeAccountCreationToken,
} from "../shared/auth/jwt"

const landingRouter = router({
	verifyEmail: publicProcedure
		.input(
			z.object({
				googleOauthAccessToken: z.string(),
			})
		)
		.mutation(async ({ input: { googleOauthAccessToken } }) => {
			const email = await getEmailFromGoogleOauthAccessToken({
				accessToken: googleOauthAccessToken,
			})

			const emailEnding = email.split("@")[1]

			const potentialSchools = await db.execute<{
				id: number
				name: string
				city: string
				state: string
			}>(
				"SELECT id, name, city, state FROM school_by_student_email_ending WHERE student_email_ending = ?",
				[emailEnding]
			)

			if (potentialSchools.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message:
						"No school on Hall associated with your email address. Ask an administrator to add your school to Hall.",
				})
			}

			return {
				accountCreationToken: encodeAccountCreationToken({ email, role: "student" }),
				potentialSchools,
				email,
			}
		}),
	getTeachersAtSchool: publicProcedure
		.input(
			z.object({
				accountCreationToken: z.string(),
				schoolId: z.number(),
			})
		)
		.query(async ({ input: { accountCreationToken, schoolId } }) => {
			const { role } = decodeAccountCreationToken({ accountCreationToken })

			if (role !== "student") throw new TRPCError({ code: "FORBIDDEN" })

			return await db.execute<{ email: string; name: string }>(
				"SELECT email, name FROM teacher WHERE school_id = ?",
				[schoolId]
			)
		}),
	createAccount: publicProcedure
		.input(
			z.object({
				accountCreationToken: z.string(),
				schoolId: z.number(),
				name: z.string(),
				teacherEmail: z.string(),
			})
		)
		.mutation(async ({ input: { accountCreationToken, schoolId, name, teacherEmail } }) => {
			const { email, role } = decodeAccountCreationToken({ accountCreationToken })

			if (role !== "student") throw new TRPCError({ code: "FORBIDDEN" })

			await db.execute(
				"INSERT INTO student (school_id, email, name, teacher_email) VALUES (?, ?, ?, ?)",
				[schoolId, email, name, teacherEmail]
			)

			return {
				accessToken: encodeAccessToken({
					email,
					name,
					schoolId,
					teacherEmail,
					role: "student",
				}),
			}
		}),
})

export default landingRouter
