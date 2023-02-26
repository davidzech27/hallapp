import { useEffect, FC } from "react"
import * as SplashScreen from "expo-splash-screen"
import useAuthStore from "./useAuthStore"

interface UserSwitchProps {
	Student: FC
	Teacher: FC
	Administrator: FC
	Unauthed: FC
}

const UserSwitch: FC<UserSwitchProps> = ({ Student, Teacher, Administrator, Unauthed }) => {
	const auth = useAuthStore()

	if (!auth.authLoaded) return null

	useEffect(() => {
		if (auth.authLoaded) SplashScreen.hideAsync()
	}, [auth.authLoaded])

	return (
		<>
			{!auth.isLandingComplete ? (
				<Unauthed />
			) : (
				{
					student: <Student />,
					teacher: <Teacher />,
					administrator: <Administrator />,
				}[auth.role!]
			)}
		</>
	)
}

export default UserSwitch
