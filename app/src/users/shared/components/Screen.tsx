import clsx from "clsx"
import { FC, ReactNode } from "react"
import { View, StatusBar } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Icon from "./Icon"

interface ScreenProps {
	children: ReactNode
	noLogo?: true
}

const Screen: FC<ScreenProps> = ({ children, noLogo }) => {
	const insets = useSafeAreaInsets()

	return (
		<View
			style={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }}
			className={clsx("flex-1 items-center px-6")}
		>
			{!noLogo && <Icon color={"primary"} />}

			{children}

			<StatusBar animated barStyle={"light-content"} />
		</View>
	)
}

export default Screen
