export {};

declare global {
	interface P5APIResponse {
		name: string,
		serveSecure: boolean,
		_id: string,
		user: {
			_id: string,
			username: string,
			id: string,
		}
		updatedAt: string,
		files: Array<{
			name: string,
			content: string,
			children: Array<String>,
			fileType: string,
			_id: string,
			isSelectedFile?: boolean,
			createdAt: string,
			updatedAt: string,
			id: string
		}>
	}
}