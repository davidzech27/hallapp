import { FC, useState, useEffect } from "react"
import { View, Text, Image, Pressable } from "react-native"
import * as ImagePicker from "expo-image-picker"
import LandingScreenContainer from "./shared/LandingScreen"
import useAuthStore from "../auth/useAuthStore"
import uploadProfilePhoto from "../lib/uploadProfilePhoto"
import Button from "../components/Button"
import Icon from "@expo/vector-icons/MaterialIcons"
import { trpc } from "../lib/trpc"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"

const imagePickerOptions: ImagePicker.ImagePickerOptions = {
	mediaTypes: ImagePicker.MediaTypeOptions.Images,
	allowsEditing: true,
	aspect: [1, 1],
	quality: 0.2,
}

interface ProfilePhotoScreenProps {
	name: string
	goToNextScreen: () => void
}

const ProfilePhotoScreen: FC<ProfilePhotoScreenProps> = ({ name, goToNextScreen }) => {
	const [chosenPhoto, setChosenPhoto] = useState<ImagePicker.ImagePickerAsset | undefined>()

	const [status, requestPermission] = ImagePicker.useCameraPermissions()

	useEffect(() => {
		const retrieveLostPhoto = async () => {
			const [result] = (await ImagePicker.getPendingResultAsync()) as [
				ImagePicker.ImagePickerResult
			]

			if (result && !result.canceled && result.assets && result.assets[0]) {
				setChosenPhoto(result.assets[0])
			}
		}

		retrieveLostPhoto()
	}, [])

	const onUseCamera = async () => {
		if (!status?.granted) {
			const { granted } = await requestPermission()

			if (!granted) return
		}

		const result = await ImagePicker.launchCameraAsync(imagePickerOptions)

		if (!result.canceled) {
			setChosenPhoto(result.assets[0])
		}
	}

	const onUseLibrary = async () => {
		const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions)

		if (!result.canceled) {
			setChosenPhoto(result.assets[0])
		}
	}

	const { mutate: useDefaultProfilePhoto } = trpc.useDefaultProfilePhoto.useMutation()

	const onSkip = () => {
		useDefaultProfilePhoto({ name })

		goToNextScreen()
	}

	const onContinue = () => {
		try {
			uploadProfilePhoto(chosenPhoto!)
		} catch (err) {
			console.log(err)
		}

		goToNextScreen()
	}

	const onChangePhoto = () => setChosenPhoto(undefined)

	const hasChosenPhoto = Boolean(chosenPhoto)

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
		<LandingScreenContainer backgroundColor="primary">
			<Text className="mx-8 mt-8 text-center text-lg font-bold leading-tight text-white">
				Add a profile photo so that students and teachers can easily identify you.
			</Text>

			<View className="flex-1 justify-center pb-[0px]">
				{chosenPhoto ? (
					<Image source={{ uri: chosenPhoto.uri }} className="h-56 w-56 rounded-full" />
				) : (
					<View className="h-56 w-56 items-center justify-center rounded-full bg-[#FFFFFF20]">
						<Icon name="camera-alt" size={124} color={"#FFFFFF86"} />
					</View>
				)}
			</View>

			{hasChosenPhoto && <View className="h-[78px]" />}

			{hasChosenPhoto ? (
				<View className="w-full">
					<Pressable
						onPress={onChangePhoto}
						onPressIn={() => (textButtonPressed.value = true)}
						onPressOut={() => (textButtonPressed.value = false)}
					>
						<Animated.Text
							style={textButtonStyle}
							className="mb-5 text-center text-2xl font-bold text-white"
						>
							Change Photo
						</Animated.Text>
					</Pressable>

					<Button color="white" text="Continue" onPress={onContinue} />
				</View>
			) : (
				<View className="w-full">
					<Pressable
						onPress={onSkip}
						onPressIn={() => (textButtonPressed.value = true)}
						onPressOut={() => (textButtonPressed.value = false)}
					>
						<Animated.Text
							style={textButtonStyle}
							className="mb-1 text-center text-2xl font-bold text-white"
						>
							Skip
						</Animated.Text>
					</Pressable>

					<View className="my-4">
						<Button
							color="white"
							outline
							text="Choose from camera roll"
							onPress={onUseLibrary}
						/>
					</View>

					<Button color="white" text="Take a photo" onPress={onUseCamera} />
				</View>
			)}
		</LandingScreenContainer>
	)
}

export default ProfilePhotoScreen
