import { Document, Model, model, Schema } from "mongoose";

export interface AuthKeysAttrs {
	id: string;
	authKey: string;
	discordName: string; //* discord tag to see whose API keys it is
}

export interface AuthKeysModel extends Model<AuthKeysDocument> {
	addOne(doc: AuthKeysAttrs): AuthKeysDocument;
}

export interface AuthKeysDocument extends Document {
	id: string;
	authKey: string;
	discordName: string;
	createdAt: string;
	updatedAt: string;
}

export const keysSchema: Schema = new Schema(
	{
		id: {
			type: String,
			required: true,
			index: true
		},
		authKey: {
			type: String,
			required: true
		},
		discordName: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

keysSchema.statics.addOne = (doc: AuthKeysDocument) => {
	return new Keys(doc);
};

export const Keys = model<AuthKeysDocument, AuthKeysModel>(
	"AuthKeys",
	keysSchema
);
