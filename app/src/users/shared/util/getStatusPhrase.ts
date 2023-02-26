export const getStatusPhrase = ({
	status,
}: {
	status: "left" | "pending" | "denied" | "approved" | "arrived"
}) =>
	({
		pending: "Awaiting approval",
		denied: "Denied",
		approved: "Approved",
		left: "Left",
		arrived: "Completed",
	}[status])
