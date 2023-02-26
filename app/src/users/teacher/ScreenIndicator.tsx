import { FC } from "react"
import { Pressable, View } from "react-native"
import Animated, {
	useAnimatedStyle,
	Layout,
	type SharedValue,
	withTiming,
} from "react-native-reanimated"
import clsx from "clsx"
import { bezierEasing } from "../shared/util/easing"

interface ScreenIndicatorProps {
	currentScreen: "left" | "right"
	onChangeScreen: (newScreen: "left" | "right") => void
}

const ScreenIndicator: FC<ScreenIndicatorProps> = ({ currentScreen, onChangeScreen }) => {
	const widthStyle = useAnimatedStyle(() => {
		return {
			width: withTiming({ left: 54, right: 58 }[currentScreen], { duration: 250 }),
		}
	}, [currentScreen])

	return (
		<View className="mx-auto h-[30px] w-[116px]">
			<Animated.View className="absolute h-full w-full rounded-full bg-black/10" />

			<Animated.View className="h-full w-full rounded-full px-[2px] py-[2px]">
				<Animated.View
					layout={Layout.duration(250).easing(bezierEasing.factory())}
					style={[widthStyle]}
					className={clsx(
						"h-full w-[54px] rounded-full bg-black/10", // w necessary because animated width doesn't work at first
						{ left: "self-start", right: "self-end" }[currentScreen]
					)}
				/>

				<View className="absolute top-0 bottom-0 left-0 right-0 flex-row">
					<Pressable
						onPress={() => onChangeScreen("left")}
						className="flex-1 items-start justify-center pl-1.5"
					>
						<Animated.Text className="text-xs font-semibold">Visiting</Animated.Text>
					</Pressable>
					<Pressable
						onPress={() => onChangeScreen("right")}
						className="flex-1 items-end justify-center pr-1.5"
					>
						<Animated.Text className="text-xs font-semibold">Leaving</Animated.Text>
					</Pressable>
				</View>
			</Animated.View>
		</View>
	)
}

export default ScreenIndicator
