import "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import * as SplashScreen from "expo-splash-screen"
import { TRPCProvider } from "./users/shared/lib/trpc"
import UserSwitch from "./users/shared/auth/UserSwitch"
import useAuthStore from "./users/shared/auth/useAuthStore"
import Landing from "./users/shared/landing/Landing"
import { LogBox } from 'react-native';
import Student from "./users/student/Student"
import Teacher from "./users/teacher/Teacher"
import Administrator from "./users/administrator/Administrator"


LogBox.ignoreAllLogs() //! remove after demo!!!!!

SplashScreen.preventAutoHideAsync()

const App = () => {
	const { loadAuthInfo, authLoaded } = useAuthStore()

	if (!authLoaded) {
		loadAuthInfo()
	}

	return (
		<TRPCProvider>
			<SafeAreaProvider>
				<UserSwitch
					Student={Student}
					Teacher={Teacher}
					Administrator={Administrator}
					Unauthed={Landing}
				/>
			</SafeAreaProvider>
		</TRPCProvider>
	)
}

export default App
