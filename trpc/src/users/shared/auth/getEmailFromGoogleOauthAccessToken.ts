import fetch from "node-fetch"

const getEmailFromGoogleOauthAccessToken = async ({ accessToken }: { accessToken: string }) => {
	return (
		(await (
			await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
		).json()) as { email: string }
	).email
}

export default getEmailFromGoogleOauthAccessToken
