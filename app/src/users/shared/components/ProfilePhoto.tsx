import { type FC, useState } from "react"
import { Pressable } from "react-native"
import Animated from "react-native-reanimated"
import { PROFILE_PHOTOS_ENDPOINT } from "env"

interface ProfilePhotoProps {
	email: string
	name: string
	extraClassname: string
	onPress?: () => void
}

const ProfilePhoto: FC<ProfilePhotoProps> = ({ email, name, onPress, extraClassname }) => {
	const [isError, setIsError] = useState(false)

	const [isFallbackError, setIsFallbackError] = useState(false)

	if (!isError) {
		return (
			<Pressable onPress={onPress} className={`aspect-square ${extraClassname}`}>
				<Animated.Image
					source={{ uri: `${PROFILE_PHOTOS_ENDPOINT}/${email}` }}
					onError={() => setIsError(true)}
					className={`aspect-square w-full flex-1 rounded-full`}
				/>
			</Pressable>
		)
	} else if (!isFallbackError) {
		return (
			<Pressable onPress={onPress} className={`aspect-square ${extraClassname}`}>
				<Animated.Image
					source={{
						uri: `https://avatars.dicebear.com/api/initials/${name
							.split(" ")
							.map((namePart) => namePart[0])
							.join("")}.jpg?backgroundColorLevel=700&fontSize=42`,
					}}
					onError={() => setIsFallbackError(true)}
					className={`aspect-square w-full flex-1 rounded-full`}
				/>
			</Pressable>
		)
	}

	return (
		<Pressable onPress={onPress} className={`aspect-square ${extraClassname}`}>
			<Animated.View className={`aspect-square rounded-full bg-[#ECECEC]`} />
		</Pressable>
	)
}

export default ProfilePhoto
