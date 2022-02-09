import { db } from "../src/database";

declare module "fastify" {
	export interface FastifyInstance {
		db: db;
	}
}
