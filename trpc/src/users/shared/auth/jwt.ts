import jwt from "jsonwebtoken"
import env from "../../../env"

export type AccessTokenPayload =
	| {
			email: string
			schoolId: number
			role: "administrator"
	  }
	| {
			email: string
			name: string
			schoolId: number
			role: "teacher"
	  }
	| {
			email: string
			name: string
			schoolId: number
			teacherEmail: string
			role: "student"
	  }

export const encodeAccessToken = (payload: AccessTokenPayload) =>
	jwt.sign(payload, env.ACCESS_TOKEN_SECRET)

export const decodeAccessToken = ({ accessToken }: { accessToken: string }) =>
	jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload

interface AccountCreationTokenPayload {
	email: string
	role: "teacher" | "student"
}

export const encodeAccountCreationToken = (payload: AccountCreationTokenPayload) =>
	jwt.sign(payload, env.ACCOUNT_CREATION_TOKEN_SECRET)

export const decodeAccountCreationToken = ({
	accountCreationToken,
}: {
	accountCreationToken: string
}) =>
	jwt.verify(
		accountCreationToken,
		env.ACCOUNT_CREATION_TOKEN_SECRET
	) as AccountCreationTokenPayload

interface SchoolCreationTokenPayload {
	email: string
	schoolId: number
	schoolName: string
	schoolCity: string
	schoolState: string
}

export const encodeSchoolCreationToken = (payload: SchoolCreationTokenPayload) =>
	jwt.sign(payload, env.ACCOUNT_CREATION_TOKEN_SECRET)

export const decodeSchoolCreationToken = ({
	schoolCreationToken,
}: {
	schoolCreationToken: string
}) =>
	jwt.verify(schoolCreationToken, env.ACCOUNT_CREATION_TOKEN_SECRET) as SchoolCreationTokenPayload
