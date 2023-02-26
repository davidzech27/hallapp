import { FC } from "react"
import ProfilePhoto from "../shared/components/ProfilePhoto"
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	Layout,
	withSpring,
	withTiming,
	withDelay,
} from "react-native-reanimated"
import { PassType } from "../../../../trpc/src/users/shared/passType"
import { Pressable, View, Text } from "react-native"
import getTimePhrase from "../shared/util/getTimePhrase"
import { getStatusPhrase } from "../shared/util/getStatusPhrase"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const Pass: FC<
	Omit<PassType, "leavingEmail" | "leavingName" | "requestedAt" | "arrivedAt" | "leftAt">
> = (pass) => {
	const longPressed = useSharedValue(
		pass.scheduledFor.getDate() === new Date().getDate() &&
			pass.scheduledFor.getMonth() === new Date().getMonth() &&
			pass.scheduledFor.getFullYear() === new Date().getFullYear()
	)

	const heightStyle = useAnimatedStyle(() => {
		return {
			height: longPressed.value
				? withSpring(122, { stiffness: 200 })
				: withSpring(96, { stiffness: 200 }),
			alignItems: longPressed.value ? "flex-start" : "center",
		}
	})

	const extraContentOpacityStyle = useAnimatedStyle(() => {
		return {
			opacity: longPressed.value
				? withDelay(150, withTiming(0.5, { duration: 100 }))
				: withDelay(150, withTiming(0, { duration: 100 })),
		}
	})

	return (
		<>
			<AnimatedPressable
				onLongPress={() => {
					longPressed.value = true
				}}
				onPressOut={() => {
					if (
						pass.scheduledFor.getDate() === new Date().getDate() &&
						pass.scheduledFor.getMonth() === new Date().getMonth() &&
						pass.scheduledFor.getFullYear() === new Date().getFullYear()
					)
						return

					longPressed.value = false
				}}
				style={heightStyle}
				className="ml-1 w-full flex-row py-3"
			>
				<ProfilePhoto
					email={pass.studentEmail}
					name={pass.studentName}
					extraClassname="h-[72px]"
				/>

				<View className="ml-2.5 mt-2 h-14 flex-1">
					<View className="flex-1 flex-row justify-between">
						<Text className="bg-bold text-xl">{pass.studentName}</Text>

						<Text className="mt-1.5 mr-1.5 text-sm text-black/50">
							{getTimePhrase({ date: pass.scheduledFor })}
						</Text>
					</View>

					<Text className="bg-bold text-primary text-base font-medium">
						{getStatusPhrase({ status: pass.status })}
					</Text>
				</View>

				<Animated.Text
					numberOfLines={2}
					style={extraContentOpacityStyle}
					className="absolute top-[92px] right-1.5 h-10"
				>
					{
						{
							pending: "Your pass request has yet to be approved",
							denied: "Your pass was denied :(",
							approved:
								"Your pass was approved! It still must be approved by both the teacher you visit and leave.",
							left: "You should be on your way to the teacher you're visiting.",
							arrived: "You have completed your trip!",
						}[pass.status]
					}
				</Animated.Text>
			</AnimatedPressable>

			<View className="h-[1px] w-full bg-black/10"></View>
		</>
	)
}

export default Pass
