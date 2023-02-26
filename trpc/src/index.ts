import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify"
import { renderTrpcPanel } from "trpc-panel"
import { appRouter } from "./app"
import { createContext } from "./context"
import server from "./server"
import env from "./env"
import uploadProfilePhotoHandler from "./users/shared/upload"
import getBotResponseHandler from "./users/shared/bot"

server.register(fastifyTRPCPlugin, {
	trpcOptions: {
		router: appRouter,
		createContext,
		onError: (
			{
				error,
				ctx: { log },
			}: any /* shouldn't need to be typed as any but vscode complains otherwise */
		) => {
			log.error(error)
		},
	},
	prefix: "/",
})

server.register(uploadProfilePhotoHandler)

server.register(getBotResponseHandler)

server.get("/panel", (_request, reply) => {
	reply.type("text/html").send(
		renderTrpcPanel(appRouter, {
			url: `http://localhost:${env.PORT}`,
			transformer: "superjson",
		})
	)
})

server.listen({ port: env.PORT })
