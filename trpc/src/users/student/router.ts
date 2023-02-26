import { router } from "../../initTRPC"
import landingRouter from "./landing"
import passRouter from "./pass"

const studentRouter = router({
	landing: landingRouter,
	pass: passRouter,
})

export default studentRouter
