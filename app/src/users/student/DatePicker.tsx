import { FC, useState, useRef, forwardRef, useImperativeHandle } from "react"
import { TextInput, View } from "react-native"
import colors from "../../../colors"

interface DatePickerProps {
	onInputChange: (newDate: Date | null) => void
	futureOnly?: boolean
}

const DatePicker = forwardRef<{ reset: () => void }, DatePickerProps>(
	({ onInputChange, futureOnly = true }, ref) => {
		const [monthInput, setMonthInput] = useState("")
		const [dayInput, setDayInput] = useState("")
		const [yearInput, setYearInput] = useState("")

		const monthInputRef = useRef<TextInput>(null)
		const dayInputRef = useRef<TextInput>(null)
		const yearInputRef = useRef<TextInput>(null)

		useImperativeHandle(ref, () => {
			return {
				reset: () => {
					setMonthInput("")
					setDayInput("")
					setYearInput("")
				},
			}
		})

		const checkIfInputIsValid = ({
			month,
			day,
			year,
		}: {
			month: string
			day: string
			year: string
		}) => {
			const monthInt = parseInt(month)
			const dayInt = parseInt(day)
			const yearInt = parseInt(year)

			const currentYear = new Date().getFullYear()

			if (
				monthInt >= 1 &&
				monthInt <= 12 &&
				dayInt >= 1 &&
				dayInt <= 31 &&
				yearInt >= currentYear - 125 &&
				yearInt <= currentYear + 100
			) {
				const date = new Date(yearInt, monthInt - 1, dayInt)

				if (!futureOnly || date.valueOf() - new Date().valueOf() > -1000 * 60 * 60 * 2) {
					return onInputChange(date)
				}

				onInputChange(null)
			} else {
				onInputChange(null)
			}
		}

		const onChangeMonthInput = (newMonthInput: string) => {
			if (newMonthInput.length > 2) {
				setMonthInput(newMonthInput.slice(0, 2))
				setDayInput((prevDayInput) => {
					const dateConcat = `${newMonthInput}${prevDayInput}${yearInput}`
					return dateConcat.slice(2, 4)
				})
				setYearInput((prevYearInput) => {
					const dateConcat = `${newMonthInput}${dayInput}${prevYearInput}`
					return dateConcat.slice(4, 8)
				})

				if (dayInput.length === 0) {
					dayInputRef.current?.focus()
				} else {
					yearInputRef.current?.focus()
				}

				checkIfInputIsValid({
					month: newMonthInput.slice(0, 2),
					day: dayInput,
					year: yearInput,
				})

				return
			}

			setMonthInput(newMonthInput)

			if (newMonthInput.length === 2) {
				dayInputRef.current?.focus()
			}

			checkIfInputIsValid({
				month: newMonthInput,
				day: dayInput,
				year: yearInput,
			})
		}

		const onChangeDayInput = (newDayInput: string) => {
			if (newDayInput.length > 2) {
				setDayInput(newDayInput.slice(0, 2))
				setYearInput((prevYearInput) => {
					const dateConcat = `${dayInput}${prevYearInput}`
					return dateConcat.slice(2, 6)
				})

				yearInputRef.current?.focus()

				checkIfInputIsValid({
					month: monthInput,
					day: newDayInput.slice(0, 2),
					year: yearInput,
				})

				return
			}

			setDayInput(newDayInput)

			if (newDayInput.length === 2) {
				yearInputRef.current?.focus()
			}

			checkIfInputIsValid({
				month: monthInput,
				day: newDayInput,
				year: yearInput,
			})
		}

		const onChangeYearInput = (newYearInput: string) => {
			if (newYearInput.length > 4) {
				setYearInput(newYearInput.slice(0, 4))

				checkIfInputIsValid({
					month: monthInput,
					day: dayInput,
					year: newYearInput.slice(0, 4),
				})

				return
			}

			setYearInput(newYearInput)

			checkIfInputIsValid({
				month: monthInput,
				day: dayInput,
				year: newYearInput,
			})
		}

		const onBackspaceDayInput = () => {
			if (dayInput.length === 0) {
				monthInputRef.current?.focus()
			}
		}

		const onBackspaceYearInput = () => {
			if (yearInput.length === 0) {
				dayInputRef.current?.focus()
			}
		}

		const onBlurMonthInput = () => {
			if (monthInput.length === 1) setMonthInput((prev) => `0${prev}`)
		}

		const onBlurDayInput = () => {
			if (dayInput.length === 1) setDayInput((prev) => `0${prev}`)
		}

		return (
			<>
				<View className="h-10 flex-row space-x-1.5">
					<TextInput
						value={monthInput}
						onChangeText={onChangeMonthInput}
						onBlur={onBlurMonthInput}
						ref={monthInputRef}
						placeholder="MM"
						placeholderTextColor="#00000033"
						selectionColor={colors.primary}
						keyboardType="number-pad"
						autoComplete="birthdate-month"
						className="w-16 text-center text-4xl font-bold text-black"
					/>
					<TextInput
						value={dayInput}
						onChangeText={onChangeDayInput}
						onKeyPress={({ nativeEvent: { key } }) => {
							if (key === "Backspace") onBackspaceDayInput()
						}}
						onBlur={onBlurDayInput}
						ref={dayInputRef}
						placeholder="DD"
						placeholderTextColor="#00000033"
						selectionColor={colors.primary}
						keyboardType="number-pad"
						autoComplete="birthdate-day"
						className="w-[52px] text-center text-4xl font-bold text-black"
					/>
					<TextInput
						value={yearInput}
						onChangeText={onChangeYearInput}
						onKeyPress={({ nativeEvent: { key } }) => {
							if (key === "Backspace") onBackspaceYearInput()
						}}
						ref={yearInputRef}
						placeholder="YYYY"
						placeholderTextColor="#00000033"
						maxLength={4}
						selectionColor={colors.primary}
						keyboardType="number-pad"
						autoComplete="birthdate-year"
						className="text-black-text -mr-4 w-[98px] text-center text-4xl font-bold"
					/>
				</View>
			</>
		)
	}
)

export default DatePicker
