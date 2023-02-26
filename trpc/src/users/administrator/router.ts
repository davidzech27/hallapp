import { router } from "../../initTRPC"
import administratorLandingRouter from "./landing"

const administratorRouter = router({
	landing: administratorLandingRouter,
})

export default administratorRouter
