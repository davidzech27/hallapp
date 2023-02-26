import { View, Text, TextInput } from "react-native"
import LandingScreenContainer, { LandingScreen } from "./shared/LandingScreen"
import Button from "../components/Button"
import { FC, useState } from "react"
import { trpc } from "../lib/trpc"
import colors from "../../../../colors"
import useKeyboard from "../hooks/useKeyboard"

interface AdministratorStudentEmailEndingScreenProps {
	goToNextScreen: (accessToken: string) => void
	teacherEmailEnding: string
	schoolCreationToken: string
}

const AdministratorStudentEmailEndingScreen: FC<AdministratorStudentEmailEndingScreenProps> = ({
	goToNextScreen,
	schoolCreationToken,
	teacherEmailEnding,
}) => {
	const [studentEmailEnding, setStudentEmailEnding] = useState("")

	const createSchool = trpc.administrator.landing.createSchool.useMutation({
		onSuccess: (data) => {
			goToNextScreen(data.accessToken)
		},
	}).mutate

	const { keyboardSpace } = useKeyboard()

	return (
		<LandingScreenContainer backgroundColor="white">
			<Text className="text-primary mx-4 mt-8 text-center text-lg font-bold leading-tight">
				What about for students?
			</Text>

			<TextInput
				value={studentEmailEnding}
				onChangeText={setStudentEmailEnding}
				autoFocus
				autoCapitalize={"none"}
				autoCorrect={false}
				placeholder="example.com"
				placeholderTextColor="#00000040"
				returnKeyType="next"
				onSubmitEditing={() =>
					createSchool({ schoolCreationToken, studentEmailEnding, teacherEmailEnding })
				}
				selectionColor={colors.primary}
				className="mt-2.5 mb-4 h-10 text-center text-4xl font-bold text-black"
			/>

			<View className="flex-1"></View>

			<Button
				color="primary"
				text="Continue"
				onPress={() =>
					createSchool({ schoolCreationToken, studentEmailEnding, teacherEmailEnding })
				}
			/>

			<View style={{ height: keyboardSpace - 32 }}></View>
		</LandingScreenContainer>
	)
}

export default AdministratorStudentEmailEndingScreen
