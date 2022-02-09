import { Document, Model, model, Schema } from "mongoose";

export interface SlugAttrs {
	slug: string;
	fileName: string;
	mimeType: string;
	createdBy: string;
}

export interface SlugModel extends Model<SlugDocument> {
	addOne(doc: SlugAttrs): SlugDocument;
}

export interface SlugDocument extends Document {
	slug: string;
	fileName: string;
	mimeType: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

export const slugsSchema: Schema = new Schema(
	{
		slug: {
			type: String,
			required: true
		},
		fileName: {
			type: String,
			required: true
		},
		mimeType: {
			type: String,
			required: true
		},
		createdBy: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

slugsSchema.statics.addOne = (doc: SlugDocument) => {
	return new Slugs(doc);
};

export const Slugs = model<SlugDocument, SlugModel>("Slugs", slugsSchema);
