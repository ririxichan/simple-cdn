import {
	FastifyInstance,
	FastifyPluginAsync,
	FastifyPluginOptions
} from "fastify";
import fp from "fastify-plugin";
import mongoose from "mongoose";

import { Models, options } from "../interfaces/db";
import { AuthKeysModel, Keys } from "./models/authkeys";
import { SlugModel, Slugs } from "./models/slug";

export interface db {
	models: Models;
}

const ConnectDB: FastifyPluginAsync<options> = async (
	fastify: FastifyInstance,
	options: FastifyPluginOptions
) => {
	try {
		mongoose.connection.on("connected", () => {
			fastify.log.info({ actor: "mongoDB" }, "connected to database");
		});

		mongoose.connection.on("disconnected", () => {
			fastify.log.error({ actor: "mongoDB" }, "lost connection with database");
		});

		const db = await mongoose.connect(options.uri),
			models: Models = { Slugs, Keys };

		fastify.decorate("db", { models });
	} catch (error) {
		console.error(error);
	}
};

export default fp(ConnectDB);
