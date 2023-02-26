import { z } from "zod"
import { redis } from "../../../lib/redis"
import { undefinedTypeGuard } from "../util/undefinedTypeGuard"

// todo - partition by city to increase scalability. at the very least make prefix search less bad, using the approach described in this article https://patshaughnessy.net/2011/11/29/two-ways-of-using-redis-to-build-a-nosql-autocomplete-search-index. also, at least make geosearch radius incrementally increasing so you can start small and use ANY
const keys = {
	schoolNames: "schoolnames",
	schoolIds: ({ name }: { name: string }) => `schoolids:${name}`,
	school: ({ id }: { id: number }) => `school:${id}`,
}

const schoolSchema = z.object({
	name: z.string(),
	city: z.string(),
	state: z.string(),
})

export const schoolSearchClient = {
	get: async ({
		schoolId,
		onParseError,
	}: {
		schoolId: number
		onParseError: (error: string) => void
	}) => {
		const parsedResult = schoolSchema.safeParse(
			await redis.hgetall(keys.school({ id: schoolId }))
		)

		if (parsedResult.success) {
			return parsedResult.data
		} else {
			onParseError(parsedResult.error.toString())

			return undefined
		}
	},
	search: async ({
		prefix,
		onParseError,
		onNotFound,
	}: {
		prefix: string
		onParseError: (error: string) => void
		onNotFound: (cause: string) => void
	}) => {
		const prefixUppercase = prefix.toUpperCase()

		const names = (
			await redis.sscan(keys.schoolNames, 0, "MATCH", `${prefixUppercase}*`, "COUNT", 200000)
		)[1] // most of the time will be on the order of 20 returned items, so no point in scaling down count
			.slice(0, 20)

		const ids = (await redis.sunion(names.map((name) => keys.schoolIds({ name }))))
			.map((id, nameIndex) =>
				id !== null
					? Number(id)
					: (onNotFound(
							`Id not found for school with name: ${names[nameIndex]}`
					  ) as undefined)
			)
			.filter(undefinedTypeGuard)

		return (
			await Promise.all(
				ids.map((id) => (typeof id === "number" ? redis.hgetall(keys.school({ id })) : id))
			)
		)
			.map((result) => {
				const parsedResult = schoolSchema.safeParse(result)

				if (parsedResult.success) {
					return parsedResult.data
				} else {
					onParseError(parsedResult.error.toString())
				}
			})
			.filter(undefinedTypeGuard)
	},
}
