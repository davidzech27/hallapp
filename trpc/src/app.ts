import { router } from "./initTRPC"
import { authedProcedure } from "./procedures"
import { z } from "zod"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { profilePhotoBucketClient } from "./lib/s3"
import env from "./env"
import administratorRouter from "./users/administrator/router"
import teacherRouter from "./users/teacher/router"
import studentRouter from "./users/student/router"

export const appRouter = router({
	administrator: administratorRouter,
	teacher: teacherRouter,
	student: studentRouter,
	useDefaultProfilePhoto: authedProcedure
		.input(z.object({ name: z.string() }))
		.mutation(async ({ input: { name }, ctx: { email } }) => {
			const defaultProfilePhoto = await fetch(
				`https://avatars.dicebear.com/api/initials/${name
					.split(" ")
					.map((namePart) => namePart[0])
					.join("")}.jpg?backgroundColorLevel=700&fontSize=42`
			)

			const defaultProfilePhotoBuffer = await defaultProfilePhoto.arrayBuffer()

			const s3Command = new PutObjectCommand({
				Bucket: env.PROFILE_PHOTO_BUCKET_NAME,
				Key: email,
				Body: defaultProfilePhotoBuffer,
				ContentType: "image/jpeg",
			})

			await profilePhotoBucketClient.send(s3Command)
		}),
})

export type AppRouter = typeof appRouter

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
