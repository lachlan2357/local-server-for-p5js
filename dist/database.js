import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { get_sketch } from "./api.js";
const db = await open({ driver: sqlite3.Database, filename: "./database.db" });
db.on("error", console.error);
export async function init_tables() {
    // console.log("deleting files");
    // await db.exec("DROP TABLE IF EXISTS Files;");
    // console.log("deleting sketches");
    // await db.exec("DROP TABLE IF EXISTS Sketches;");
    await db.exec(`CREATE TABLE IF NOT EXISTS Sketches (
		username VARCHAR NOT NULL,
		sketch_id VARCHAR NOT NULL,

		PRIMARY KEY (username, sketch_id)
	);`);
    await db.exec(`CREATE TABLE IF NOT EXISTS Files (
		username VARCHAR NOT NULL,
		sketch_id VARCHAR NOT NULL,
		file_name VARCHAR NOT NULL,
		file_contents VARCHAR NOT NULL,

		PRIMARY KEY (username, sketch_id, file_name),
		FOREIGN KEY (username, sketch_id) REFERENCES Sketches (username, sketch_id)
	);`);
}
export async function send_file(req, res) {
    const { username, sketch_id, file_path } = req.params;
    if (username === undefined || sketch_id === undefined)
        res.status(404).send("Could not fetch the file.");
    await ensure_exists(username, sketch_id);
    const file_path_filled = file_path ?? "index.html";
    const file_contents = await get_file(username, sketch_id, file_path_filled);
    let mime_type = "text/text";
    if (file_path_filled.endsWith(".html"))
        mime_type = "html";
    else if (file_path_filled.endsWith("css"))
        mime_type = "css";
    else if (file_path_filled.endsWith("js"))
        mime_type = "javascript";
    if (file_contents === undefined)
        res.status(404).send("File has not been cached.");
    else
        res.contentType(mime_type).send(file_contents);
}
export async function get_file(username, sketch_id, file_path) {
    const result = await db.get("SELECT * FROM Files WHERE username = ? AND sketch_id = ? AND file_name = ?;", username, sketch_id, file_path);
    if (result === undefined)
        return undefined;
    const content = result.file_contents;
    return content;
}
export async function get_all_projects() {
    return await db.all("SELECT * FROM Sketches;");
}
export async function ensure_exists(username, sketch_id) {
    const result = await db.get("SELECT * FROM Sketches WHERE username = ? AND sketch_id = ?;", username, sketch_id);
    if (result !== undefined)
        return;
    await db.run("INSERT INTO Sketches (username, sketch_id) VALUES (?, ?);", username, sketch_id);
    const data = await get_sketch(username, sketch_id);
    await cache_sketch(username, sketch_id, data);
}
async function cache_sketch(username, sketch_id, data) {
    console.log("caching sketch ...");
    const entity_map = new Map();
    const parent_tree = new Map();
    for (const file of data.files) {
        const id = file.id;
        entity_map.set(id, file);
        for (const child of file.children)
            parent_tree.set(child, id);
    }
    for (const [id, parent_id] of parent_tree) {
        const file = entity_map.get(id);
        if (file === undefined)
            throw `Cannot find entity with id ${id}`;
        if (file.fileType === "folder")
            continue;
        let path = file.name;
        let current_parent_id = parent_id;
        while (true) {
            const parent = entity_map.get(current_parent_id);
            if (parent === undefined)
                throw `Cannot find parent with id ${current_parent_id}`;
            if (parent.name === "root")
                break;
            path = `${parent.name}/${path}`;
            const new_parent_id = parent_tree.get(parent.id);
            if (new_parent_id === undefined)
                throw `Cannot find parent of entity with id ${current_parent_id}`;
            current_parent_id = new_parent_id;
        }
        const statement = await db.prepare("INSERT INTO Files (username, sketch_id, file_name, file_contents) VALUES (?, ?, ?, ?);", username, sketch_id, path, file.content);
        await statement.run();
        console.log(`cached file ${path}`);
    }
}
