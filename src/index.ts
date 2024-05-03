import express from "express";

import {  ensure_exists, get_file, init_tables } from "./database.js";

const app = express();
const port = 3000;

app.use((_res, _req, next) => {
	init_tables();
	next();
});

app.get("/", (_req, res) => res.send("Pretend this page does something cool for now."))

app.get("/sketch/:username/:sketch_id/:path(*)", async (req, res) => {
	const { username, sketch_id, path: file_path } = req.params;

	await ensure_exists(username, sketch_id);

	const content = await get_file(username, sketch_id, file_path)
	if (content === undefined) res.status(404).send(`File '${file_path} could not be found for project '${sketch_id}' by '${username}'.`);
	else res.send(content);
});

app.get("*", (_req, res) => res.send("This ain't it, chief."))

app.listen(port, () => console.log("Listening on port", port));