import HTTPS from "https";

export interface P5APIResponse {
	name: string,
	serveSecure: boolean,
	_id: string,
	user: {
		_id: string,
		username: string,
		id: string,
	}
	updatedAt: string,
	files: Array<P5File>
}

export interface P5File {
	name: string,
	content: string,
	children: Array<string>,
	fileType: string,
	_id: string,
	isSelectedFile?: boolean,
	createdAt: string,
	updatedAt: string,
	id: string
}

export async function get_sketch(username: string, sketch_id: string): Promise<P5APIResponse> {
	const url = `https://editor.p5js.org/editor/${username}/projects/${sketch_id}`;
	const response = await new Promise<string>((resolve, reject) => {
		HTTPS.get(url, res => {
			let body = "";
			
			res.on("data", text => body += text.toString());
			res.on("error", e => reject(e));
			res.on("close", () => resolve(body));
		});
	});
	
	return JSON.parse(response);
}