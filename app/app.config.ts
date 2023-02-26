import type { ExpoConfig, ConfigContext } from "expo/config"

export default ({ config }: ConfigContext): ExpoConfig => {
	return {
		name: "hall",
		slug: "hall",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/icon.png",
		userInterfaceStyle: "automatic",
		splash: {
			image: "./assets/icon.png",
			resizeMode: "contain",
			backgroundColor: "#FFFFFF",
		},
		updates: {
			fallbackToCacheTimeout: 0,
		},
		assetBundlePatterns: ["**/*"],
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/icon.png",
				backgroundColor: "#FFFFFF",
			},
		},
		plugins: [
			[
				"expo-image-picker",
				{
					photosPermission: "Your photos are used to choose your profile photo from.",
					cameraPermission: "Your camera is used to take your profile photo.",
				},
			],
		],
		jsEngine: "hermes",
	}
}
