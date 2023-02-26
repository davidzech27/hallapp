import { type FastifyPluginCallback } from "fastify"
import { Readable } from "stream"
import fs from "fs"
import { OpenAIApi, Configuration } from "openai"
import env from "../../env"
import getAccessTokenFromRequest from "./auth/getAccessTokenFromHeaders"
import { decodeAccessToken, type AccessTokenPayload } from "./auth/jwt"

const prompt = fs.readFileSync("./botPrompt.txt/", "utf8")

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

		const previousConversation = req.body

		if (typeof previousConversation !== "string") {
			return reply.status(500).send("Must send previous conversation in body")
		}

		const config = new Configuration({
			apiKey: env.OPENAI_KEY,
		})

		const openai = new OpenAIApi(config)

		try {
			const openaiResponse: any = await openai.createCompletion(
				{
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
					max_tokens: null, //! change later
					stream: true,
				},
				{ responseType: "stream" }
			)

			const readableStream = new Readable({
				async read() {
					openaiResponse.data.on("data", (data: any) => {
						const lines = data
							.toString()
							.split("\n")
							.filter((line: any) => line.trim() !== "")

						for (const line of lines) {
							const message = line.replace(/^data: /, "")
							if (message === "[DONE]") {
								return // stream finished
							}
							try {
								const parsed = JSON.parse(message)

								const text = parsed.choices[0].text

								this.push(text)
							} catch (error) {
								instance.log.error(
									"Could not JSON parse stream message",
									message,
									error
								)
							}
						}
					})

					this.push(null)
				},
			})

			reply.type("text/plain").send(readableStream)

			return reply
		} catch (err) {
			return reply.status(500).send()
		}
	})

	done()
}

export default getBotResponseHandler
