import { FC, useState } from "react"
import { Text, TextInput, View } from "react-native"
import LandingScreenContainer from "./shared/LandingScreen"
import colors from "../../../../colors"
import { trpc } from "../lib/trpc"
import useKeyboard from "../hooks/useKeyboard"
import Button from "../components/Button"

interface NameScreenProps {
	goToNextScreen: (args: { accessToken: string; name: string }) => void
	role: "student" | "teacher"
	teacherEmail?: string
	accountCreationToken: string
	schoolId: number
}

const NameScreen: FC<NameScreenProps> = ({
	goToNextScreen,
	role,
	accountCreationToken,
	teacherEmail,
	schoolId,
}) => {
	const [nameInput, setNameInput] = useState("")

	const createAccountStudent = trpc.student.landing.createAccount.useMutation({
		onSuccess({ accessToken }) {
			goToNextScreen({ name: nameInput, accessToken })
		},
	}).mutate
	const createAccountTeacher = trpc.teacher.landing.createAccount.useMutation({
		onSuccess({ accessToken }) {
			goToNextScreen({ name: nameInput, accessToken })
		},
	}).mutate

	const { keyboardSpace } = useKeyboard()

	const onSubmit = () => {
		if (role === "student") {
			createAccountStudent({
				accountCreationToken,
				name: nameInput,
				schoolId,
				teacherEmail: teacherEmail!,
			})
		} else {
			createAccountTeacher({ accountCreationToken, name: nameInput, schoolId })
		}
	}

	return (
		<LandingScreenContainer backgroundColor="white">
			<Text className="text-primary mx-4 mt-8 text-center text-lg font-bold leading-tight">
				Now, what's your name?
			</Text>

			<TextInput
				value={nameInput}
				onChangeText={setNameInput}
				autoFocus
				autoCorrect={false}
				placeholder="Your name"
				placeholderTextColor="#00000040"
				returnKeyType="next"
				onSubmitEditing={onSubmit}
				selectionColor={colors.primary}
				className="mt-2.5 mb-4 h-10 text-center text-4xl font-bold text-black"
			/>

			<View className="flex-1"></View>

			<Button color="primary" text="Continue" onPress={onSubmit} />

			<View style={{ height: keyboardSpace - 32 }}></View>
		</LandingScreenContainer>
	)
}

export default NameScreen
