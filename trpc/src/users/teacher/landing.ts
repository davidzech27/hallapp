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
		.mutation(async ({ input: { googleOauthAccessToken }, ctx: { log } }) => {
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
				"SELECT id, name, city, state FROM school_by_teacher_email_ending WHERE teacher_email_ending = ?",
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
				accountCreationToken: encodeAccountCreationToken({ email, role: "teacher" }),
				potentialSchools,
			}
		}),
	createAccount: publicProcedure
		.input(
			z.object({
				accountCreationToken: z.string(),
				schoolId: z.number(),
				name: z.string(),
			})
		)
		.mutation(async ({ input: { accountCreationToken, schoolId, name } }) => {
			const { email, role } = decodeAccountCreationToken({ accountCreationToken })

			if (role !== "teacher") throw new TRPCError({ code: "FORBIDDEN" })

			await db.execute("INSERT INTO teacher (school_id, email, name) VALUES (?, ?, ?)", [
				schoolId,
				email,
				name,
			])

			return {
				accessToken: encodeAccessToken({ email, name, schoolId, role: "teacher" }),
			}
		}),
})

export default landingRouter
