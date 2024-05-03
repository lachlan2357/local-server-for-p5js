import sqlite3 from "sqlite3";
import { open } from "sqlite";
const db = await open({ driver: sqlite3.Database, filename: "./database.db" });
// interface FileRow {
// 	sketch_id: string,
// 	file_type: "html" | "css" | "js",
// 	file_contents: string
// }
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
export async function cache_project(sketch_id) {
    const res = await db.get("SELECT * FROM Cache WHERE sketch_id = ?;", sketch_id);
    const exists = res !== undefined;
    // setup database depending on whether it is already cached
    if (exists)
        await db.run("DELETE FROM Files WHERE sketch_id = ?;", sketch_id);
    else
        await db.run("INSERT INTO Cache (sketch_id) VALUES (?);", sketch_id);
}
