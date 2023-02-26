import { FC, useState, useRef, Fragment, useMemo } from "react"
import Screen from "../shared/components/Screen"
import ProfilePhoto from "../shared/components/ProfilePhoto"
import AntIcon from "@expo/vector-icons/AntDesign"
import { View, Modal, useWindowDimensions, Pressable, Text, TextInput } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { trpc } from "../shared/lib/trpc"
import Button from "../shared/components/Button"
import useKeyboard from "../shared/hooks/useKeyboard"
import DatePicker from "./DatePicker"
import colors from "../../../colors"
import clsx from "clsx"
import LoadingSpinner from "../shared/components/LoadingSpinner"
import useAuthStore from "../shared/auth/useAuthStore"
import getTimePhrase from "../shared/util/getTimePhrase"
import { getStatusPhrase } from "../shared/util/getStatusPhrase"
import Pass from "./Pass"
import BotOpener from "../shared/bot/BotOpener"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const AnimatedIcon = Animated.createAnimatedComponent(AntIcon)

const Student: FC = () => {
	const leavingTeacherEmail = useAuthStore().teacherEmail!
	const { data } = trpc.student.pass.passTimeline.useQuery()

	const passTimeline = useMemo(() => data?.reverse(), [data])

	const { data: teachers } = trpc.student.pass.getTeachersAtSchool.useQuery()

	const datePickerRef = useRef<{ reset: () => void }>(null)

	const { mutate: requestPass, isLoading: requestLoading } =
		trpc.student.pass.requestPass.useMutation({
			onSuccess: () => {
				setRequestingPass(false)

				setVisitingTeacherNameInput("")

				datePickerRef.current?.reset()

				setReasonInput("")

				queryClient.student.pass.passTimeline.invalidate()
			},
		})

	const [visitingTeacherNameInput, setVisitingTeacherNameInput] = useState("")

	const [scheduledForInput, setScheduledForInput] = useState<Date | null>(null)

	const [reasonInput, setReasonInput] = useState("")

	const queryClient = trpc.useContext()

	const onRequest = async () => {
		if (scheduledForInput) {
			const teacherIndex = teachers?.findIndex(
				(teacher) =>
					visitingTeacherNameInput.toLowerCase() ===
						teacher.name.toLowerCase().slice(0, visitingTeacherNameInput.length) &&
					teacher.email !== leavingTeacherEmail
			)

			if (teacherIndex === -1 || teacherIndex === undefined) return

			const teacher = teachers![teacherIndex]
			console.log({ teacher })
			requestPass({
				scheduledFor: scheduledForInput,
				visitingEmail: teacher.email,
				reason: reasonInput,
			})
		}
	}

	const [requestingPass, setRequestingPass] = useState(false)

	const requestButtonPressed = useSharedValue(false)

	const requestButtonStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scale: requestButtonPressed.value
						? withTiming(0.95, {
								duration: 75,
						  })
						: withTiming(1, { duration: 75 }),
				},
			],
		}
	})

	const requestButtonPlusStyle = useAnimatedStyle(() => {
		return {
			opacity: requestButtonPressed.value
				? withTiming(0.5, {
						duration: 75,
				  })
				: withTiming(1, { duration: 75 }),
		}
	})

	const { keyboardSpace } = useKeyboard()

	return (
		<Screen>
			{passTimeline === undefined ? null : passTimeline.length === 0 ? (
				<Text className="mx-4 mt-4 text-center text-lg">
					You have no passes yet! Use the button in the lower right-hand corner request
					some!
				</Text>
			) : (
				passTimeline.map((pass) => (
					<Fragment key={pass.id.toString()}>
						<Pass {...pass} />
					</Fragment>
				))
			)}

			<BotOpener />

			<Modal
				visible={requestingPass}
				animationType="slide"
				presentationStyle="formSheet"
				onRequestClose={() => setRequestingPass(false)}
				className="w-full flex-1"
			>
				<Screen noLogo>
					<View className="mt-2 mb-4 w-full flex-1 items-center justify-around">
						<TextInput
							value={visitingTeacherNameInput}
							onChangeText={setVisitingTeacherNameInput}
							autoFocus
							autoCorrect={false}
							placeholder="Teacher name"
							placeholderTextColor="#00000040"
							returnKeyType="send"
							onSubmitEditing={onRequest}
							selectionColor={colors.primary}
							className="mt-2.5 h-10 text-center text-4xl font-bold text-black"
						/>

						<Pressable
							onPress={() => {
								const teacherIndex = teachers?.findIndex(
									(teacher) =>
										visitingTeacherNameInput.toLowerCase() ===
											teacher.name
												.toLowerCase()
												.slice(0, visitingTeacherNameInput.length) &&
										teacher.email !== leavingTeacherEmail
								)

								if (teacherIndex === -1 || teacherIndex === undefined) return

								const teacher = teachers![teacherIndex]

								setVisitingTeacherNameInput(teacher.name)
							}}
						>
							<Text className="text-sm font-bold text-black/80 active:text-black/40">
								{(teachers?.findIndex(
									(teacher) =>
										visitingTeacherNameInput === teacher.name &&
										teacher.email !== leavingTeacherEmail
								) === -1 &&
									visitingTeacherNameInput.length !== 0 &&
									teachers?.find(
										(teacher) =>
											visitingTeacherNameInput.toLowerCase() ===
												teacher.name
													.toLowerCase()
													.slice(0, visitingTeacherNameInput.length) &&
											teacher.email !== leavingTeacherEmail
									)?.email) ??
									"No teacher found"}
							</Text>
						</Pressable>

						<DatePicker ref={datePickerRef} onInputChange={setScheduledForInput} />

						<TextInput
							value={reasonInput}
							onChangeText={setReasonInput}
							placeholder="Reason (optional)"
							placeholderTextColor="#00000040"
							returnKeyType="send"
							onSubmitEditing={onRequest}
							selectionColor={colors.primary}
							className="mt-[26px] mb-4 h-10 text-center text-4xl font-bold text-black"
						/>
					</View>
					<Button
						color="primary"
						disabled={(() => {
							const teacherIndex = teachers?.findIndex(
								(teacher) =>
									visitingTeacherNameInput.toLowerCase() ===
										teacher.name.toLowerCase() &&
									teacher.email !== leavingTeacherEmail
							)

							console.log({ teacherIndex })

							if (teacherIndex === -1 || teacherIndex === undefined) return true

							if (scheduledForInput === null) return true

							return false
						})()}
						onPress={onRequest}
					>
						{!requestLoading ? (
							<Text className={clsx("text-center text-2xl font-bold text-white")}>
								Request pass
							</Text>
						) : (
							<View>
								<Text className={clsx("text-center text-2xl font-bold text-white")}>
									Requesting pass <LoadingSpinner color="white" size={30} />
								</Text>
							</View>
						)}
					</Button>

					<View style={{ height: keyboardSpace - 16 }}></View>
				</Screen>
			</Modal>

			<AnimatedPressable
				onPress={() => setRequestingPass(true)}
				onPressIn={() => (requestButtonPressed.value = true)}
				onPressOut={() => (requestButtonPressed.value = false)}
				style={requestButtonStyle}
				className="bg-primary absolute bottom-12 right-8 h-20 w-20 items-center justify-center rounded-full"
			>
				<AnimatedIcon name="plus" size={56} color="white" style={requestButtonPlusStyle} />
			</AnimatedPressable>
		</Screen>
	)
}

export default Student
