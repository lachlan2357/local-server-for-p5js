import express from "express";

import {  ensure_exists, init_tables } from "./database.js";

const app = express();
const port = 3000;

app.use((_res, _req, next) => {
	init_tables();
	next();
});

app.get("/sketch/:username/:sketch_id/*", async (req, res) => {
	ensure_exists(req.params.username, req.params.sketch_id);
});

app.get("*", (_req, res) => res.send("This ain't it, chief."))

app.listen(port, () => console.log("Listening on port", port));