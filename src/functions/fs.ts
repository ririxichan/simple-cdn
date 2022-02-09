import { readFileSync, unlinkSync, writeFileSync } from "fs";

export const saveFile = async (fileName: string, file: Buffer) => {
		const filePath = `${process.cwd()}/public/${fileName}`;
		try {
			await writeFileSync(filePath, file, "utf-8");
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	},
	readFile = async (fileName: string) => {
		const filePath = `${process.cwd()}/public/${fileName}`;
		try {
			const file = await readFileSync(filePath);
			return file;
		} catch (err) {
			console.error(err);
			return false;
		}
	},
	deleteFile = async (fileName: string) => {
		const filePath = `${process.cwd()}/public/${fileName}`;
		try {
			await unlinkSync(filePath);
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	};
