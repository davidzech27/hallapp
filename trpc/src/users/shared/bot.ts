import { type FastifyPluginCallback } from "fastify"
import { Readable } from "stream"
import fs from "fs"
import { join } from "path"
import { OpenAIApi, Configuration } from "openai"
import env from "../../env"
import getAccessTokenFromRequest from "./auth/getAccessTokenFromHeaders"
import { decodeAccessToken, type AccessTokenPayload } from "./auth/jwt"

const prompt = fs.readFileSync(join(__dirname, "botPrompt.txt"), "utf8")

const getBotResponseHandler: FastifyPluginCallback = (instance, _options, done) => {
	instance.post("/getBotResponse", async (req, reply) => {
		const accessToken = getAccessTokenFromRequest({ headers: req.headers })

		if (!accessToken) {
			return reply.status(401).send()
		}

		let accessTokenPayload: AccessTokenPayload //! later use this for rate limiting purposes

		try {
			accessTokenPayload = decodeAccessToken({ accessToken })
		} catch {
			return reply.status(401).send()
		}

		const { previousConversation } = req.body as any

		if (typeof previousConversation !== "string") {
			return reply.status(500).send("Must send previous conversation in body")
		}

		const config = new Configuration({
			apiKey: env.OPENAI_KEY,
		})

		const openai = new OpenAIApi(config)

		try {
			const openaiResponse = await openai.createCompletion({
				prompt: `${prompt} You are speaking to a ${
					{
						student: "student at a school where the app is being used",
						teacher: "teacher at a school where the app is being used",
						administrator:
							"school administrator who has set the app up for their school",
					}[accessTokenPayload.role]
				}, and should tailor your answers, tone, and explanations accordingly.

                    ${previousConversation}`,
				model: "text-davinci-003",
				max_tokens: 256,
				top_p: 1,
				temperature: 0.7,
				frequency_penalty: 0,
				presence_penalty: 0,
				best_of: 1,
			})

			const conversation = openaiResponse.data.choices[0].text

			instance.log.info({ conversation })

			return reply.status(200).send({ conversation })
		} catch (err) {
			instance.log.error(err)

			return reply.status(500).send()
		}
	})

	done()
}

export default getBotResponseHandler
