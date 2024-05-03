import sqlite3 from "sqlite3";
import { open } from "sqlite";
import {get} from "https"

const db = await open({ driver: sqlite3.Database, filename: "./database.db" });

export function init_tables() {
	// db.exec("DROP TABLE IF EXISTS Cache;");
	db.exec(`CREATE TABLE IF NOT EXISTS Cache (
		sketch_id VARCHAR NOT NULL PRIMARY KEY
	);`);

	// db.exec("DROP TABLE IF EXISTS Files;");
	db.exec(`CREATE TABLE IF NOT EXISTS Files (
		sketch_id VARCHAR NOT NULL,
		file_type VARCHAR NOT NULL,
		file_contents VARCHAR NOT NULL,

		PRIMARY KEY (sketch_id),
		FOREIGN KEY (sketch_id) REFERENCES Cache (sketch_id),
		CHECK (file_type in ("html", "css", "js"))
	);`);
}

/**
 * Cache a given P5.js project at a url hosted at `editor.p5js.org`.
 * 
 * @param {string} sketch_id The ID of the sketch.
 */
export async function cache_project(sketch_id) {
	// determine if the sketched is already cached
	/** @type {CacheTable | undefined} */
	const res = await db.get("SELECT * FROM Cache WHERE sketch_id = ?;", sketch_id);
	const exists = res !== undefined;

	// setup database depending on whether it is already cached
	if (exists) await db.run("DELETE FROM Files WHERE sketch_id = ?;", sketch_id);
	else await db.run("INSERT INTO Cache (sketch_id) VALUES (?);", sketch_id);

	// request the p5js API for the files
	const url = `https://editor.p5js.org/editor/creativecoding/projects/${sketch_id}`;
	/** @type {string} */
	const response = await new Promise((resolve, reject) => {
		const req = get(url, res => {
			let body = "";
			
			res.on("data", text => body += text.toString());
			res.on("error", e => reject(e));
			res.on("close", () => resolve(body));
		});
	});
	/** @type {P5APIResponse} */
	const json = JSON.parse(response);
}