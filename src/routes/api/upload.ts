import {
	FastifyInstance,
	FastifyPluginAsync,
	FastifyPluginOptions
} from "fastify";
import fp from "fastify-plugin";

import { saveFile } from "../../functions/fs";
import { slugBody } from "../../interfaces/slug";
import { randomString } from "../../util/random";

const uploadRoute: FastifyPluginAsync = async (
	server: FastifyInstance,
	options: FastifyPluginOptions
) => {
	server.post<{ Body: slugBody }>("/api/v1/upload", {}, async (req, res) => {
		try {
			const authkey = req.headers["Authorization"],
				{ Keys, Slugs } = server.db.models,
				validKey = await Keys.findOne({ authkey });

			if (!validKey) return res.code(401).send("Invalid Authorization Token");

			const data = await req.file(),
				buffer = await data.toBuffer(),
				fields = data.fields,
				// @ts-expect-error: It never is MultipartValue for some reason
				randomName = fields.randomName?.value ?? new Boolean(true).toString(),
				readFile = await Slugs.findOne({ fileName: data.filename }),
				randomSlug =
					randomName.toLowerCase() === "true"
						? `${await randomString(16)}.${data.filename.split(".").pop()}`
						: data.filename,
				fileName =
					randomName.toLowerCase() === "true"
						? `${randomSlug}.${data.filename.split(".").pop()}`
						: data.filename;

			if (readFile) return res.code(403).send("File already exists.");

			const slugs = await Slugs.addOne({
				slug: randomSlug,
				fileName,
				mimeType: data.mimetype,
				createdBy: validKey.id
			});

			const file = await saveFile(fileName, buffer);
			if (!file)
				return res.code(400).send("There was an error with upload. Try again.");

			await slugs.save();
			return res.code(201).send({
				slug: slugs.slug,
				url: `https://${process.env.DOMAIN}/${slugs.slug}`
			});
		} catch (error) {
			req.log.error(error);
			return res.send(500);
		}
	});
};

export default fp(uploadRoute);
