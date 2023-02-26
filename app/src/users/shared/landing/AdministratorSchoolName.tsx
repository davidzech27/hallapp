import LandingScreenContainer, { LandingScreen } from "./shared/LandingScreen"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Text, TextInput, View, Pressable } from "react-native"
import colors from "../../../../colors"
import { trpc } from "../lib/trpc"

const AdministratorSchoolName: LandingScreen<{ schoolId: number }> = ({ goToNextScreen }) => {
	const [schoolNameInput, setSchoolNameInput] = useState("")

	const { refetch: search } = trpc.administrator.landing.searchSchoolByPrefix.useQuery(
		{ prefix: schoolNameInput },
		{
			enabled: false,
			onSuccess(data) {
				setSchools(data)
			},
		}
	)

	const [schools, setSchools] = useState<
		{
			name: string
			city: string
			state: string
			id: number
		}[]
	>([])

	const queryClient = trpc.useContext()

	const debouncedSearch = useDebouncedCallback(() => {
		search()
	}, 400)

	const onChangeSchoolNameInput = (newSchoolNameInput: string) => {
		setSchoolNameInput(newSchoolNameInput)

		queryClient.administrator.landing.searchSchoolByPrefix.cancel()

		debouncedSearch()
	}

	return (
		<LandingScreenContainer backgroundColor="white">
			<Text className="text-primary mx-4 mt-6 text-center text-lg font-bold leading-tight">
				What school would you like to set up Hall for?
			</Text>

			<TextInput
				value={schoolNameInput}
				onChangeText={onChangeSchoolNameInput}
				autoFocus
				autoCorrect={false}
				placeholder="School name"
				placeholderTextColor="#00000040"
				selectionColor={colors.primary}
				className="mt-2.5 mb-4 h-10 text-center text-4xl font-bold text-black"
			/>

			{schoolNameInput.length !== 0 &&
				schools?.slice(0, 3).map((school) => {
					console.log({ school })

					return (
						<Pressable
							key={school.id}
							onPress={() => goToNextScreen({ schoolId: school.id })}
							className="mt-1.5 w-full rounded-lg px-6 active:bg-black/10"
						>
							<Text className="text-lg leading-[0]">
								{school.name
									.split(" ")
									.map((word) => word.toLowerCase())
									.map((word) =>
										word.length > 2
											? word.slice(0, 1).toUpperCase() + word.slice(1)
											: word
									)
									.join(" ")}
							</Text>

							<Text className="text-primary mt-1 mb-1.5">
								{school.city}, {school.state}
							</Text>
						</Pressable>
					)
				})}
		</LandingScreenContainer>
	)
}

export default AdministratorSchoolName
