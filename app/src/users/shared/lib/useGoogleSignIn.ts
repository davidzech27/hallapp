import Constants from "expo-constants"
import * as AuthSession from "expo-auth-session"
import * as Google from 'expo-auth-session/providers/google';
import {useEffect} from "react"
import { EXPO_CLIENT_ID, PROJECT_NAME_FOR_PROXY } from "env";

const EXPO_REDIRECT_PARAMS = { useProxy: true, projectNameForProxy: PROJECT_NAME_FOR_PROXY }

const REDIRECT_PARAMS =
	Constants.appOwnership === "expo" ? EXPO_REDIRECT_PARAMS : process.exit(1)
const redirectUri = AuthSession.makeRedirectUri(REDIRECT_PARAMS)

function useGoogleSignin({ onSuccess }: {onSuccess: (accessToken: string) => void}) {
	const [request, response, promptAsync] = Google.useAuthRequest({
		expoClientId: EXPO_CLIENT_ID,
		redirectUri,
	})

	useEffect(() => {
		if (response?.type === "success") {
			const { params } = response
			onSuccess(params.access_token)
		}
	}, [response, request])

	return {promptAsync}

}

export default useGoogleSignin
