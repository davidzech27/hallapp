import { create } from "zustand"
import { combine } from "zustand/middleware"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"

const accessTokenKey = "accessToken"
const roleKey = "role"
const isLandingCompleteKey = "isLandingComplete"

type Role = "administrator" | "teacher" | "student"

const useAuthStore = create(
	combine(
		{
			accessToken: undefined,
			role: undefined,
			isLandingComplete: undefined,
			authLoaded: false,
		} as
			| {
					accessToken: string
					role: Role
					isLandingComplete: true
					authLoaded: true
			  }
			| {
					accessToken: string | null
					role: Role | null
					isLandingComplete: false
					authLoaded: true
			  }
			| {
					accessToken: undefined
					role: undefined
					isLandingComplete: undefined
					authLoaded: false
			  },
		(set) => ({
			setAccessToken: async (accessToken: string) => {
				set({ accessToken })

				await SecureStore.setItemAsync(accessTokenKey, accessToken)
			},
			setRole: async ({ role }: { role: Role }) => {
				set({ role })

				await AsyncStorage.setItem(roleKey, role)
			},
			completeLanding: async () => {
				set({ isLandingComplete: true })

				await AsyncStorage.setItem(isLandingCompleteKey, "true")
			},
			loadAuthInfo: async () => {
				// await SecureStore.deleteItemAsync(accessTokenKey); await SecureStore.deleteItemAsync(roleKey); await SecureStore.deleteItemAsync(isLandingCompleteKey)
				const [accessToken, role, isLandingComplete] = await Promise.all([
					SecureStore.getItemAsync(accessTokenKey),
					AsyncStorage.getItem(roleKey),
					AsyncStorage.getItem(isLandingCompleteKey),
				])

				if (accessToken && role && isLandingComplete) {
					set({
						accessToken,
						role: role as Role,
						isLandingComplete: true,
						authLoaded: true,
					})
				} else {
					set({
						accessToken,
						role: role as Role | null,
						isLandingComplete: false,
						authLoaded: true,
					})
				}
			},
		})
	)
)

export default useAuthStore

type State = typeof useAuthStore extends (selector: infer U) => any
	? U extends (state: infer V) => any
		? V
		: never
	: never
