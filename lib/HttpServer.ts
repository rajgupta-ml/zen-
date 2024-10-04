import { IHttpRequest, IHttpResponse } from "./Interface";
import { ZenResponse } from "./response";
import { TcpServer } from "./TcpServer";


type IRouteHandlerCallback = (request: IHttpRequest, response: IHttpResponse) => void

export class zen extends TcpServer {
	private availableRoutes: { [Key: string]: Map<string, IRouteHandlerCallback> }
	constructor() {
		super()
		this.availableRoutes = {
			GET: new Map(),
			POST: new Map(),
			PUT: new Map(),
			DELETE: new Map()
		}
	}
	handleRequest(data: Buffer): string {
		const request: IHttpRequest = this.parseRequest(data);
		const response = new ZenResponse()
		const handler = this.availableRoutes[request.method]?.get(request.url)
		// Get request
		if (handler) {
			handler(request, response)
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
		this.availableRoutes.GET.set(url, cb)
	}
	post(url: string, cb: IRouteHandlerCallback) {
		this.availableRoutes.POST.set(url, cb)
	}
	put(url: string, cb: IRouteHandlerCallback) {
		this.availableRoutes.PUT.set(url, cb)
	}
	delete(url: string, cb: IRouteHandlerCallback) {
		this.availableRoutes.DELETE.set(url, cb)
	}

}
