import { config } from "dotenv";
import { fastify } from "fastify";
import fastifyMultipart from "fastify-multipart";
import pino from "pino";

import db from "./database/index";
import preHook from "./hooks/preHook";
import deleteRoute from "./routes/api/delete";
import uploadRoute from "./routes/api/upload";
import slugRoutes from "./routes/slug";

config();

const port = process.env.PORT || 8080,
	uri = process.env.MONGODB_URI || "mongodb://localhost:27017/slugs",
	server = fastify({
		logger: pino({ level: "info" })
	});

//* Register plugins
server.register(fastifyMultipart);

//* Register database to fastify instance
server.register(db, { uri });

//* Register Routes
server.register(uploadRoute);
server.register(deleteRoute);
server.register(slugRoutes);

//* Register Hooks
server.register(preHook);

const start = async () => {
	try {
		await server.listen(port);
		console.log("Server started successfully");
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

start();
