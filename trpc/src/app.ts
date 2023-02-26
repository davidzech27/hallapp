import { router } from "./initTRPC"
import administratorRouter from "./users/administrator/router"
import teacherRouter from "./users/teacher/router"
import studentRouter from "./users/student/router"

export const appRouter = router({
	administrator: administratorRouter,
	teacher: teacherRouter,
	student: studentRouter,
})

export type AppRouter = typeof appRouter

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
