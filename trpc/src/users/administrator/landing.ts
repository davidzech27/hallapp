import { router } from "../../initTRPC"
import { administratorProcedure, publicProcedure } from "../../procedures"
import { z } from "zod"
import { db } from "../../lib/db"
import getEmailFromGoogleOauthAccessToken from "../shared/auth/getEmailFromGoogleOauthAccessToken"
import { TRPCError } from "@trpc/server"
import { redisClient } from "../shared/redis/client"
import {
	decodeSchoolCreationToken,
	encodeAccessToken,
	encodeSchoolCreationToken,
} from "../shared/auth/jwt"

const administratorLandingRouter = router({
	verifyEmail: publicProcedure
		.input(
			z.object({
				googleOauthAccessToken: z.string(),
				schoolId: z.number(),
			})
		)
		.mutation(async ({ input: { googleOauthAccessToken, schoolId }, ctx: { log } }) => {
			const [[existingRegisteredSchool], email, schoolInfo] = await Promise.all([
				db.execute<{ id: number; administratorEmail: string }>(
					"SELECT id, administrator_email FROM school WHERE id = ?",
					[schoolId]
				),
				getEmailFromGoogleOauthAccessToken({ accessToken: googleOauthAccessToken }),
				redisClient.schoolSearch.get({
					schoolId,
					onParseError: (error) => log.error(error),
				}),
			])

			if (existingRegisteredSchool === undefined) {
				if (schoolInfo === undefined)
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "School not found. This is probably a bug. We're sorry!",
					})

				return {
					schoolAlreadyCreated: false,
					schoolCreationToken: encodeSchoolCreationToken({
						email,
						schoolId,
						schoolName: schoolInfo.name,
						schoolCity: schoolInfo.city,
						schoolState: schoolInfo.state,
					}),
				}
			} else if (existingRegisteredSchool.administratorEmail === email) {
				return {
					schoolAlreadyCreated: true,
					accessToken: encodeAccessToken({ email, schoolId, role: "administrator" }),
				}
			} else {
				throw new TRPCError({
					code: "CONFLICT",
					message:
						"School already registered under another email. Ask other administrators at your school to see if they've already logged in, or contact us if you suspect someone has wrongfully claimed your school.",
				})
			}
		}),
	createSchool: publicProcedure
		.input(
			z.object({
				schoolCreationToken: z.string(),
				teacherEmailEnding: z.string(),
				studentEmailEnding: z.string(),
			})
		)
		.mutation(
			async ({ input: { schoolCreationToken, teacherEmailEnding, studentEmailEnding } }) => {
				const { email, schoolId, schoolName, schoolCity, schoolState } =
					decodeSchoolCreationToken({ schoolCreationToken })

				await db.execute(
					"INSERT INTO school (id, administrator_email, teacher_email_ending, student_email_ending, name, city, state) VALUES (?, ?, ?, ?, ?, ?, ?)",
					[
						schoolId,
						email,
						teacherEmailEnding,
						studentEmailEnding,
						schoolName,
						schoolCity,
						schoolState,
					]
				)
			}
		),
	searchSchoolByPrefix: publicProcedure
		.input(z.object({ prefix: z.string() }))
		.query(async ({ input: { prefix }, ctx: { log } }) => {
			return await redisClient.schoolSearch.search({
				prefix,
				onParseError: (error) => log.error(error),
				onNotFound: (error) => log.error(error),
			})
		}),
})

export default administratorLandingRouter
