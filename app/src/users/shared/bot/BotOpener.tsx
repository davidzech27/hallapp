import { FC, useState } from "react"
import { View, Modal, Text, TextInput, Pressable } from "react-native"
import MaterialIcon from "@expo/vector-icons/MaterialIcons"
import getBotResponse from "../lib/getBotReponse"
import Button from "../components/Button"
import colors from "../../../../colors"
import Screen from "../components/Screen"
import LoadingSpinner from "../components/LoadingSpinner"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const BotOpener: FC = () => {
	const [visible, setVisible] = useState(false)

	const [conversation, setConversation] = useState("")

	const [messageInput, setMessageInput] = useState("")

	const [generating, setGenerating] = useState(true)

	const onChat = () => {
		setConversation((prev) => prev + messageInput)
		setMessageInput("")

		setGenerating(true)

		getBotResponse({
			previousConversation: conversation + "\n" + messageInput,
		}).then((conversation) => {
			conversation && setConversation((prev) => prev + conversation)

			setGenerating(false)
		})
	}

	const insets = useSafeAreaInsets()

	return (
		<>
			<Pressable
				onPress={() => setVisible(true)}
				className="absolute left-10 active:opacity-50"
				style={{ top: insets.top + 12 }}
			>
				<MaterialIcon name="question-answer" color={colors.primary} size={36} />
			</Pressable>

			<Modal
				visible={visible}
				presentationStyle="formSheet"
				animationType="slide"
				onRequestClose={() => setVisible(false)}
			>
				<Screen>
					<Text className="text-primary mt-4 text-center text-xl font-bold">
						Confused? Curious? Talk to Hall itself!
					</Text>
					<Text className="flex-1 rounded-2xl bg-[#FFFFFF10] px-3 py-4">
						{conversation}
					</Text>
					<TextInput
						value={messageInput}
						onChangeText={setMessageInput}
						placeholder="Ask Hall anything you want!"
						placeholderTextColor="#00000033"
						selectionColor={colors.primary}
						className="mb-4 w-full text-center text-xl font-bold text-black"
					></TextInput>
					{generating ? (
						<Button color="primary" disabled={true}>
							<Text className="ml-[154px]">
								<LoadingSpinner color="white" size={36} />
							</Text>
						</Button>
					) : (
						<Button
							text="Chat!"
							color="primary"
							onPress={onChat}
							disabled={messageInput === ""}
						/>
					)}
				</Screen>
			</Modal>
		</>
	)
}

export default BotOpener
