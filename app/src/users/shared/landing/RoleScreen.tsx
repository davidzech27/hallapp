import { Text, View, Pressable } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import LandingScreenContainer, { type LandingScreen } from "./shared/LandingScreen"
import Button from "../components/Button"

const RoleScreen: LandingScreen<"student" | "teacher" | "administrator"> = ({ goToNextScreen }) => {
	const textButtonPressed = useSharedValue(false)

	const textButtonStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scale: textButtonPressed.value
						? withTiming(0.95, {
								duration: 75,
						  })
						: withTiming(1, { duration: 75 }),
				},
			],
		}
	})

	return (
		<LandingScreenContainer backgroundColor="primary" first>
			<Text className="mx-4 mt-8 text-center text-lg font-bold leading-tight text-white">
				Welcome to Hall! Which role describes you the best?
			</Text>

			<View className="flex-1" />

			<View className="w-full">
				<Pressable
					onPress={() => goToNextScreen("administrator")}
					onPressIn={() => (textButtonPressed.value = true)}
					onPressOut={() => (textButtonPressed.value = false)}
				>
					<Animated.Text
						style={textButtonStyle}
						className="mb-1 text-center text-2xl font-bold text-white"
					>
						I'm an administrator
					</Animated.Text>
				</Pressable>

				<View className="my-4">
					<Button
						onPress={() => goToNextScreen("teacher")}
						text="I'm a teacher"
						color="white"
						outline
					/>
				</View>

				<Button
					onPress={() => goToNextScreen("student")}
					text="I'm a student"
					color="white"
				/>
			</View>
		</LandingScreenContainer>
	)
}

export default RoleScreen
