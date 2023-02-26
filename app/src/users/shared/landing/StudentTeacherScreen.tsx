import { FC } from "react"
import { Text, View, Pressable } from "react-native"
import { trpc } from "../lib/trpc"
import LandingScreenContainer from "./shared/LandingScreen"
import ProfilePhoto from "../components/ProfilePhoto"

interface StudentTeacherScreenProps {
	schoolId: number
	accountCreationToken: string
	goToNextScreen: (teacherEmail: string) => void
}

const StudentTeacherScreen: FC<StudentTeacherScreenProps> = ({
	schoolId,
	goToNextScreen,
	accountCreationToken,
}) => {
	const { data: teachers } = trpc.student.landing.getTeachersAtSchool.useQuery({
		schoolId,
		accountCreationToken,
	})

	return (
		<LandingScreenContainer backgroundColor="white">
			<Text className="text-primary mx-4 mt-8 text-center text-lg font-bold leading-tight">
				Which teacher are you signing up for Hall with?
			</Text>

			<View className="h-4"></View>

			{teachers?.map((teacher) => {
				return (
					<Pressable
						key={teacher.email}
						onPress={() => goToNextScreen(teacher.email)}
						className="mt-3 w-full flex-row rounded-lg px-6 active:bg-black/10"
					>
						<ProfilePhoto
							email={teacher.email}
							name={teacher.name}
							onPress={() => goToNextScreen(teacher.email)}
							extraClassname="h-12 w-12 m-0.5 mr-3"
						/>

						<View>
							<Text className="text-lg leading-[0]">{teacher.name}</Text>

							<Text className="text-primary mt-1 mb-3">{teacher.email}</Text>
						</View>
					</Pressable>
				)
			})}
		</LandingScreenContainer>
	)
}

export default StudentTeacherScreen
