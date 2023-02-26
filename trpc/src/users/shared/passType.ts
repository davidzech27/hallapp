import { types } from "cassandra-driver"

export type PassStatusType = "pending" | "denied" | "approved" | "left" | "arrived"

export type PassType =
	| {
			scheduledFor: Date
			id: types.Uuid
			status: "pending"
			studentEmail: string
			studentName: string
			leavingEmail: string
			leavingName: string
			visitingEmail: string
			visitingName: string
			reason: string
			teacherComment: null
			requestedAt: Date
			leftAt: null
			arrivedAt: null
	  }
	| {
			scheduledFor: Date
			id: types.Uuid
			status: "denied" | "approved"
			studentEmail: string
			studentName: string
			leavingEmail: string
			leavingName: string
			visitingEmail: string
			visitingName: string
			reason: string
			teacherComment: string | null
			requestedAt: Date
			leftAt: null
			arrivedAt: null
	  }
	| {
			scheduledFor: Date
			id: types.Uuid
			status: "left"
			studentEmail: string
			studentName: string
			leavingEmail: string
			leavingName: string
			visitingEmail: string
			visitingName: string
			reason: string
			teacherComment: string | null
			requestedAt: Date
			leftAt: Date
			arrivedAt: null
	  }
	| {
			scheduledFor: Date
			id: types.Uuid
			status: "arrived"
			studentEmail: string
			studentName: string
			leavingEmail: string
			leavingName: string
			visitingEmail: string
			visitingName: string
			reason: string
			teacherComment: string | null
			requestedAt: Date
			leftAt: Date
			arrivedAt: Date
	  }
