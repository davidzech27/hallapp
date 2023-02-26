import { router } from "../../initTRPC"
import landingRouter from "./landing"

const teacherRouter = router({
	landing: landingRouter,
})

export default teacherRouter
