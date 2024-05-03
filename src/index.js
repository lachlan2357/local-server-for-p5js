import express from "express";

import { cache_project, init_tables } from "./database.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
	res.send("Hello, world!");
});

app.listen(port, () => console.log("Listening on port", port));

init_tables();
await cache_project("guH8NAjhS");