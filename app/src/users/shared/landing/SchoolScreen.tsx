import { FC } from "react"
import { Text, View } from "react-native"
import Button from "../components/Button"
import LandingScreenContainer from "./shared/LandingScreen"
import { Alert } from "react-native"

interface SchoolScreenProps {
	role: "teacher" | "student"
	potentialSchools: { id: number; state: string; city: string; name: string }[]
	goToNextScreen: (schoolId: number) => void
}

const SchoolScreen: FC<SchoolScreenProps> = ({ role, goToNextScreen, potentialSchools }) => {
	const school = potentialSchools[0] //! later display all associated schools

	return (
		<LandingScreenContainer backgroundColor="white">
			<Text className="text-primary mx-4 mt-8 text-center text-lg font-bold leading-tight">
				Is this your school?
			</Text>

			<View className="flex-1"></View>

			<Text className="mb-1.5 text-center text-4xl">
				{school.name
					.split(" ")
					.map((word) => word.toLowerCase())
					.map((word) =>
						word.length > 2 ? word.slice(0, 1).toUpperCase() + word.slice(1) : word
					)
					.join(" ")}
			</Text>

			<Text className="text-primary text-center text-xl font-medium">
				{school.city}, {school.state}
			</Text>

			<View className="flex-[1.1]"></View>

			<Button
				color="primary"
				outline
				text="Nope"
				onPress={() =>
					Alert.alert(
						"Sorry!",
						"Your school has not yet been registered with Hall. Ask an administrator to set it up for your school."
					)
				}
			/>

			<View className="h-4"></View>

			<Button color="primary" text="Indeed" onPress={() => goToNextScreen(school.id)} />
		</LandingScreenContainer>
	)
}

export default SchoolScreen
