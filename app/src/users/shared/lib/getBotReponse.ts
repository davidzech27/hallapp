import getHeaders from "../auth/getHeaders"
import { TRPC_URL } from "env"

const getBotResponse = async ({ previousConversation }: { previousConversation: string }) => {
	try {
		const response = await fetch(`${TRPC_URL}/getBotResponse`, {
			body: JSON.stringify({
				previousConversation,
			}),
			method: "POST",
			headers: {
				...getHeaders(),
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})

		return (await response.json()).conversation as string
	} catch (err) {
		console.error(err)
	}
}

export default getBotResponse
