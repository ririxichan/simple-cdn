import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

import { deleteFile } from "../../functions/fs";
import { slugParams } from "../../interfaces/slug";

const deleteRoute: FastifyPluginAsync = async (
	server: FastifyInstance,
	options: FastifyPluginOptions
) => {
	server.delete<{ Params: slugParams }>("/:slugID", {}, async (req, res) => {
		try {
			const authkey = req.headers["Authorization"],
				{ Keys, Slugs } = server.db.models,
				validKey = await Keys.findOne({ authkey });

			if (!validKey) return res.code(403).send("Invalid Authorization Token");

			const ID = req.params.slugID,
				slug = await Slugs.findOne({ slug: ID });

			if (!slug)
				return res.code(404).send("Requested resource does not exist.");

			if (validKey.id.toString() !== slug.createdBy.toString())
				return res.code(403).send("You don't have access to remove this file.");

			const file = await deleteFile(slug.fileName);

			if (!file)
				return res.code(404).send("Requested resource does not exist.");

			await Slugs.deleteOne({ slug: ID });

			return res.code(200).send("File successfully removed.");
		} catch (error) {
			req.log.error(error);
			return res.code(400).send("Request failed. Try again.");
		}
	});
};

export default fp(deleteRoute);
