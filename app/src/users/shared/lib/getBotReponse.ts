import getHeaders from "../auth/getHeaders"
import { TRPC_URL } from "env"

const getBotResponse = async ({
	previousConversation,
	onData,
}: {
	previousConversation: string
	onData: (data: string) => void
}) => {
	try {
		await fetch(`${TRPC_URL}/getBotResponse`, {
			body: previousConversation,
			method: "POST",
		})
			.then((response) => {
				if (!response.body) {
					throw new Error("No response.body")
				}
				const reader = response.body.getReader()

				return new ReadableStream({
					start(controller) {
						function push() {
							reader.read().then(({ done, value }) => {
								if (done) {
									controller.close()
									return
								}

								controller.enqueue(value)
								push()
							})
						}

						push()
					},
				})
			})
			.then((stream) => {
				const decoder = new TextDecoder()
				const reader = stream.getReader()

				function read() {
					reader.read().then(({ done, value }) => {
						if (done) {
							return
						}

						const data = decoder.decode(value)

						onData(data)

						read()
					})
				}

				read()
			})
	} catch (err) {
		console.error(err)
	}
}

export default getBotResponse
