import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

const preHook: FastifyPluginAsync = async (
	server: FastifyInstance,
	options: FastifyPluginOptions
) => {
	server.addHook("preHandler", (req, res, done) => {
		res.header("x-Responded-By", "ririxi-cdn");
		res.header("X-Response-Time", res.getResponseTime());
		done();
	});
};

export default fp(preHook);
