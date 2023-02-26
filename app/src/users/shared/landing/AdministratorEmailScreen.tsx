import { View, Text } from "react-native"
import LandingScreenContainer, { LandingScreen } from "./shared/LandingScreen"
import Button from "../components/Button"
import { trpc } from "../lib/trpc"
import useGoogleSignin from "../lib/useGoogleSignIn"
import { FC } from "react"

const AdministratorEmailScreen: FC<{
	goToNextScreen: (
		result:
			| { schoolAlreadyCreated: false; schoolCreationToken: string }
			| { schoolAlreadyCreated: true; accessToken: string; email: string }
	) => void
	schoolId: number
}> = ({ goToNextScreen, schoolId }) => {
	const verifyEmail = trpc.administrator.landing.verifyEmail.useMutation().mutate

	const { promptAsync } = useGoogleSignin({
		onSuccess: (accessToken) =>
			verifyEmail(
				{ googleOauthAccessToken: accessToken, schoolId },
				{ onSuccess: (result) => goToNextScreen(result) }
			),
	})

	return (
		<LandingScreenContainer backgroundColor="white">
			<Text className="text-primary mx-4 mt-8 text-center text-lg font-bold leading-tight">
				Sign in with your school email
			</Text>

			<View className="flex-1"></View>

			<Button onPress={() => promptAsync()} text="Sign in" color="primary" />
		</LandingScreenContainer>
	)
}

export default AdministratorEmailScreen
