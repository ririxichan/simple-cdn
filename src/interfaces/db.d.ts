import { AuthKeysModel } from "../database/models/authkeys";
import { SlugModel } from "../database/models/slug";

export interface Models {
	Slugs: SlugModel;
	Keys: AuthKeysModel;
}

export interface options {
	uri: string;
}
