const getTimePhrase = ({ date }: { date: Date }) => {
	const currentDate = new Date()

	const timeDifference = currentDate.getTime() - date.getTime()

	if (timeDifference > 0) {
		const [weeksAgo, daysAgo, hoursAgo, minutesAgo, secondsAgo] = [
			Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7)),
			Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
			Math.floor(timeDifference / (1000 * 60 * 60)),
			Math.floor(timeDifference / (1000 * 60)),
			Math.floor(timeDifference / 1000),
		]
		if (weeksAgo) {
			return `${weeksAgo} week${weeksAgo === 1 ? "" : "s"} ago`
		} else if (daysAgo) {
			return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`
		} else return "Today"
	} else {
		const dayDifference = date.getDay() - currentDate.getDay()

		if (dayDifference >= 7) {
			return `${date.getMonth() + 1}/${date.getDate()}/${date
				.getFullYear()
				.toString()
				.slice(2)}`
		} else {
			return `This ${
				["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
					date.getDay()
				]
			}`
		}
	}
}

export default getTimePhrase
