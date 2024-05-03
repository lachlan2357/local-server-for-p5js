import HTTPS from "https";
export async function get_sketch(username, sketch_id) {
    const url = `https://editor.p5js.org/editor/${username}/projects/${sketch_id}`;
    const response = await new Promise((resolve, reject) => {
        HTTPS.get(url, res => {
            let body = "";
            res.on("data", text => body += text.toString());
            res.on("error", e => reject(e));
            res.on("close", () => resolve(body));
        });
    });
    return JSON.parse(response);
}
