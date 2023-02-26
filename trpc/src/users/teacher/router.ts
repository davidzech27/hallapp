import { router } from "../../initTRPC"
import teacherLandingRouter from "./landing"

const teacherRouter = router({
	landing: teacherLandingRouter,
})

export default teacherRouter
