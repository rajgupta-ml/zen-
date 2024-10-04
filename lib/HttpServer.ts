import { IHttpRequest, IHttpResponse } from "./Interface";
import { ZenResponse } from "./response";
import { TcpServer } from "./TcpServer";


type IRouteHandlerCallback = (request: IHttpRequest, response: IHttpResponse) => void

export class zen extends TcpServer {
	private availableRoutes: Map<string, IRouteHandlerCallback>
	constructor() {
		super()
		this.availableRoutes = new Map()
	}
	handleRequest(data: Buffer): string {
		const request: IHttpRequest = this.parseRequest(data);
		const response = new ZenResponse()
		// Get request
		if (request.method === "GET" && this.availableRoutes.has(request.url)) {
			const handler = this.availableRoutes.get(request.url);
			if (handler) {
				handler(request, response);
			}
		} else {
			response.status(404).send('404 not found')
		}
		return response.formatResponse(response);
	}

	parseRequest(data: Buffer): IHttpRequest {
		const [headersString, body] = data.toString().split("\r\n\r\n");
		const [requestLines, ...headerLines] = headersString.split("\r\n");
		const [method, url] = requestLines.split(" ");


		const headers: { [Key: string]: string } = {};

		for (const line of headerLines) {
			const [key, value] = line.split(": ")
			headers[key.toLowerCase()] = value
		}
		return { method, url, headers, body }
	}

	get(url: string, cb: IRouteHandlerCallback) {
		this.availableRoutes.set(url, cb)
	}
}
