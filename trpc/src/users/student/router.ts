import { router } from "../../initTRPC"
import studentLandingRouter from "./landing"

const studentRouter = router({
	landing: studentLandingRouter,
})

export default studentRouter
