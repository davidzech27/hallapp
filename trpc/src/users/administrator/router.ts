import { router } from "../../initTRPC"
import landingRouter from "./landing"

const administratorRouter = router({
	landing: landingRouter,
})

export default administratorRouter
