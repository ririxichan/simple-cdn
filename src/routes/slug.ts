import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

import { readFile } from "../functions/fs";
import { slugParams } from "../interfaces/slug";

const SlugRoute: FastifyPluginAsync = async (
	server: FastifyInstance,
	options: FastifyPluginOptions
) => {
	server.get<{ Params: slugParams }>("/:slugID", {}, async (req, res) => {
		try {
			const ID = req.params.slugID,
				{ Slugs } = server.db.models,
				slug = await Slugs.findOne({ slug: ID });

			if (!slug)
				return res.code(404).send("Requested resource does not exist.");

			const file = await readFile(slug.fileName);

			if (!file)
				return res.code(404).send("Requested resource does not exist.");

			res.type(slug.mimeType);
			return res.code(200).send(file);
		} catch (error) {
			req.log.error(error);
			return res.code(400).send("Request failed. Try again.");
		}
	});
};

export default fp(SlugRoute);
