import { TcpServer } from "./TcpServer";

export class zen extends TcpServer {
	constructor() {
		super()
	}
	handleRequest(data: Buffer): string {
		const newData = data.toString();
		// Get request
		// Post request
		// put request
		// delete request
		return newData
	}
}
