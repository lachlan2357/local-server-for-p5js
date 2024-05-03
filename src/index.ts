import express from "express";

import {  ensure_exists, get_file, init_tables, send_file } from "./database.js";

const app = express();
const port = 3000;

app.use((_res, _req, next) => {
	init_tables();
	next();
});

app.get("/", (_req, res) => res.send("Pretend this page does something cool for now."))

app.get("/:username/sketches/:sketch_id/:file_path(*)", send_file);

app.get("*", (_req, res) => res.send("This ain't it, chief."))

app.listen(port, () => console.log("Listening on port", port));