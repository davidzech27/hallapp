import { TRPCError } from "@trpc/server"
import { t } from "../../../initTRPC"
import { decodeAccessToken } from "./jwt"
import getAccessTokenFromHeaders from "./getAccessTokenFromHeaders"

export const isStudent = t.middleware(async ({ ctx: { headers }, next }) => {
	let accessToken: string | undefined

	accessToken = getAccessTokenFromHeaders({ headers })

	if (!accessToken) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}

	try {
		const { email, schoolId, role } = decodeAccessToken({ accessToken })

		if (role !== "student") {
			throw new TRPCError({ code: "FORBIDDEN" })
		}

		return next({
			ctx: {
				email,
				schoolId,
			},
		})
	} catch {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
})

export const isTeacher = t.middleware(async ({ ctx: { headers }, next }) => {
	let accessToken: string | undefined

	accessToken = getAccessTokenFromHeaders({ headers })

	if (!accessToken) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}

	try {
		const { email, schoolId, role } = decodeAccessToken({ accessToken })

		if (role !== "teacher") {
			throw new TRPCError({ code: "FORBIDDEN" })
		}

		return next({
			ctx: {
				email,
				schoolId,
			},
		})
	} catch {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
})

export const isAdministrator = t.middleware(async ({ ctx: { headers }, next }) => {
	let accessToken: string | undefined

	accessToken = getAccessTokenFromHeaders({ headers })

	if (!accessToken) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}

	try {
		const { email, schoolId, role } = decodeAccessToken({ accessToken })

		if (role !== "administrator") {
			throw new TRPCError({ code: "FORBIDDEN" })
		}

		return next({
			ctx: {
				email,
				schoolId,
			},
		})
	} catch {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
})
