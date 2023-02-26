import clsx from "clsx"
import { FC, ReactNode } from "react"
import { useWindowDimensions, StatusBar } from "react-native"
import Animated, { withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import colors from "../../../../../colors"
import Icon from "../../components/Icon"
import { bezierEasing } from "../../util/easing"

interface LandingScreenContainerProps {
	backgroundColor: "white" | "primary"
	children: ReactNode
	first?: boolean
}

const LandingScreenContainer: FC<LandingScreenContainerProps> = ({
	children,
	backgroundColor,
	first,
}) => {
	const screenWidth = useWindowDimensions().width

	const enteringAnimation = () => {
		"worklet"

		return {
			initialValues: {
				transform: [
					{
						translateX: screenWidth,
					},
				],
			},
			animations: {
				transform: [
					{
						translateX: withTiming(0, {
							easing: bezierEasing,
							duration: 500,
						}),
					},
				],
			},
		}
	}

	const exitingAnimation = () => {
		"worklet"

		return {
			initialValues: {
				transform: [{ translateX: 0 }],
			},
			animations: {
				transform: [
					{
						translateX: withTiming(-screenWidth, {
							easing: bezierEasing,
							duration: 500,
						}),
					},
				],
			},
		}
	}

	const insets = useSafeAreaInsets()

	return (
		<Animated.View
			entering={!first ? enteringAnimation : undefined}
			exiting={exitingAnimation}
			style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
			className={clsx(
				"flex-1 items-center px-6",
				backgroundColor === "white" ? "bg-white" : "bg-primary"
			)}
		>
			<Icon color={backgroundColor === "white" ? "primary" : "white"} />

			{children}

			<StatusBar animated barStyle={backgroundColor !== "white" ? "light-content" : "dark-content"} />
		</Animated.View>
	)
}

export default LandingScreenContainer

type LandingScreenProps<TNextScreenArgs = void> = {
	goToNextScreen: (args: TNextScreenArgs) => void
}

export type LandingScreen<TNextScreenArgs = void> = FC<LandingScreenProps<TNextScreenArgs>>
