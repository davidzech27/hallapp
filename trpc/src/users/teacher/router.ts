import { router } from "../../initTRPC"
import landingRouter from "./landing"
import passRouter from "./pass"

const teacherRouter = router({
	landing: landingRouter,
	pass: passRouter,
})

export default teacherRouter
