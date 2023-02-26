import { View, Text, TextInput } from "react-native"
import LandingScreenContainer, { LandingScreen } from "./shared/LandingScreen"
import Button from "../components/Button"
import { useState } from "react"
import { trpc } from "../lib/trpc"
import colors from "../../../../colors"
import useKeyboard from "../hooks/useKeyboard"

const AdministratorTeacherEmailEndingScreen: LandingScreen<{
	teacherEmailEnding: string
}> = ({ goToNextScreen }) => {
	const [teacherEmailEndingInput, setTeacherEmailEndingInput] = useState("")

	const { keyboardSpace } = useKeyboard()

	return (
		<LandingScreenContainer backgroundColor="white">
			<Text className="text-primary mx-4 mt-[26px] text-center text-lg font-bold leading-tight">
				What email ending are teachers assigned at your school?
			</Text>

			<TextInput
				value={teacherEmailEndingInput}
				onChangeText={setTeacherEmailEndingInput}
				autoFocus
				autoCorrect={false}
				autoCapitalize={"none"}
				placeholder="example.com"
				placeholderTextColor="#00000040"
				selectionColor={colors.primary}
				onSubmitEditing={() =>
					goToNextScreen({ teacherEmailEnding: teacherEmailEndingInput })
				}
				returnKeyType="next"
				className="mt-4 mb-4 h-10 text-center text-4xl font-bold text-black"
			/>

			<View className="flex-1"></View>

			<Button
				color="primary"
				text="Continue"
				onPress={() => goToNextScreen({ teacherEmailEnding: teacherEmailEndingInput })}
			/>

			<View style={{ height: keyboardSpace - 32 }}></View>
		</LandingScreenContainer>
	)
}

export default AdministratorTeacherEmailEndingScreen
