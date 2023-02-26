import { FC, useState } from "react"
import BotOpener from "../shared/bot/BotOpener"
import { View } from "react-native"
import Screen from "../shared/components/Screen"
import { trpc } from "../shared/lib/trpc"
import LeavingPass from "./LeavingPass"
import ScreenSwiper from "./ScreenSwiper"
import Icon from "../shared/components/Icon"
import clsx from "clsx"
import VisitingPass from "./VisitingPass"

import ScreenIndicator from "./ScreenIndicator"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const Teacher: FC = () => {
	const [screen, setScreen] = useState<"left" | "right">("left")

	const acknowledgeArrived = trpc.teacher.pass.acknowledgeArrived.useMutation()

	const acknowledgeLeft = trpc.teacher.pass.acknowledgeLeft.useMutation()

	const approvePass = trpc.teacher.pass.approvePass.useMutation()

	const denyPass = trpc.teacher.pass.denyPass.useMutation()

	const leavingPassTimeline = trpc.teacher.pass.leavingPassTimeline.useQuery().data

	const visitingPassTimeline = trpc.teacher.pass.visitingPassTimeline.useQuery().data

	const insets = useSafeAreaInsets()

	return (
		<View>
			<BotOpener></BotOpener>

			<View style={{ height: insets.top + 16 }} />

			<View className="mb-4 items-center">
				<Icon color="primary" />
			</View>

			<ScreenIndicator currentScreen={screen} onChangeScreen={setScreen} />

			<ScreenSwiper
				initialIndex={0}
				onIndexChange={(index) => setScreen(index === 0 ? "left" : "right")}
			>
				<View
					style={{ paddingBottom: insets.bottom + 16 }}
					className={clsx("flex-1 items-center px-6")}
				>
					{visitingPassTimeline?.map((pass, id) => {
						console.log({ pass })

						return <VisitingPass key={id} {...pass} />
					})}
				</View>

				<View
					style={{ paddingBottom: insets.bottom + 16 }}
					className={clsx("flex-1 items-center px-6")}
				>
					{leavingPassTimeline?.map((pass, id) => (
						<LeavingPass key={id} {...pass} />
					))}
				</View>
			</ScreenSwiper>
		</View>
	)
}

export default Teacher
