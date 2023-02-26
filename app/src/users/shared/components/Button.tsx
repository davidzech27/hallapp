import { type FC } from "react"
import { Pressable } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import clsx from "clsx"

interface ButtonProps {
	text: string
	color: "white" | "primary"
	onPress?: () => void
	disabled?: boolean
	outline?: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const Button: FC<ButtonProps> = ({ color, text, disabled, onPress, outline }) => {
	const pressed = useSharedValue(false)

	const buttonStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scale: pressed.value
						? withTiming(0.95, {
								duration: 75,
						  })
						: withTiming(1, { duration: 75 }),
				},
			],
			opacity: disabled ? withTiming(0.5, { duration: 75 }) : withTiming(1, { duration: 75 }),
		}
	})

	const textStyle = useAnimatedStyle(() => {
		return {
			opacity:
				pressed.value && !outline
					? withTiming(0.5, { duration: 75 })
					: withTiming(1, { duration: 75 }),
		}
	}, [outline])

	return (
		<AnimatedPressable
			onPress={onPress}
			onPressIn={() => {
				pressed.value = true
			}}
			onPressOut={() => {
				pressed.value = false
			}}
			disabled={disabled}
			style={buttonStyle}
			className={clsx(
				"h-[84px] w-full justify-center rounded-2xl",
				!outline
					? {
							white: "bg-white",
							primary: "bg-primary",
					  }[color]
					: "border-[3px] " + {
							white: "border-white",
							primary: "border-primary",
					  }[color]
			)}
		>
			<Animated.Text
				style={textStyle}
				className={clsx(
					"text-center text-2xl font-bold",
					!outline
						? color === "white"
							? "text-primary"
							: "text-white"
						: {
								white: "text-white",
								primary: "text-primary",
						  }[color]
				)}
			>
				{text}
			</Animated.Text>
		</AnimatedPressable>
	)
}

export default Button
