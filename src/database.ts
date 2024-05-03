import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Nullable } from "./utils.js";
import { P5APIResponse, P5File, get_sketch } from "./api.js";

const db = await open({ driver: sqlite3.Database, filename: "./database.db" });

interface CacheRow {
	username: string
	sketch_id: string
}

interface FileRow {
	username: string
	sketch_id: string,
	file_type: "html" | "css" | "js",
	file_contents: string
}

export async function init_tables() {
	// await db.exec("DROP TABLE IF EXISTS Cache;");
	await db.exec(`CREATE TABLE IF NOT EXISTS Cache (
		username VARCHAR NOT NULL,
		sketch_id VARCHAR NOT NULL

		PRIMARY KEY (username, sketch_id)
	);`);

	// await db.exec("DROP TABLE IF EXISTS Files;");
	await db.exec(`CREATE TABLE IF NOT EXISTS Files (
		username VARCHAR NOT NULL,
		sketch_id VARCHAR NOT NULL,
		file_type VARCHAR NOT NULL,
		file_contents VARCHAR NOT NULL,

		PRIMARY KEY (username, sketch_id),
		FOREIGN KEY (username, sketch_id) REFERENCES Cache (username, sketch_id),
		CHECK (file_type in ("html", "css", "js"))
	);`);
}

export async function ensure_exists(username: string, sketch_id: string) {
	const result: CacheRow | undefined = await db.get("SELECT * FROM Cache WHERE username = ? AND sketch_id = ?;", username, sketch_id);

	if (result !== undefined) return;
	await db.run("INSERT INTO Cache (username, sketch_id) VALUES (?, ?);", username, sketch_id);

	const data = await get_sketch(username, sketch_id);
	await cache_project(username, sketch_id, data);
}

async function cache_project(username: string, sketch_id: string, data: P5APIResponse) {
	const entity_map = new Map<string, P5File>();
	const child_tree = new Set<[string, string]>();

	for (const file of data.files) {
		const id = file.id;
		entity_map.set(id, file);

		for (const child of file.children) child_tree.add([id, child]);
	}
}