import { IHttpRequest, IHttpResponse } from "./Interface";
import { ZenResponse } from "./response";
import { TcpServer } from "./TcpServer";


type RouteHandlerCallback = (request: IHttpRequest, response: IHttpResponse) => Promise<void> | void
type MiddlewareFunction = (Request: IHttpRequest, response: IHttpResponse, next: () => void) => Promise<void> | void
export class zen extends TcpServer {
	private availableRoutes: { [Key: string]: Map<string, RouteHandlerCallback> }
	private middleware: MiddlewareFunction[] = []
	constructor() {
		super()
		this.availableRoutes = {
			GET: new Map(),
			POST: new Map(),
			PUT: new Map(),
			DELETE: new Map()
		}
	}
	async handleRequest(data: Buffer): Promise<string> {
		try {

			const request: IHttpRequest = this.parseRequest(data);
			const response = new ZenResponse()
			const handler = this.availableRoutes[request.method]?.get(request.url);

			//run all the middleware first
			await this.applyMiddleware(request, response);
			// Get request
			if (handler) {
				await handler(request, response)
			} else {
				response.status(404).send('404 not found')
			}


			if (request.headers["connection"]?.toLowerCase() === "keep-alive") {
				response.append('Connection', 'keep-alive')
			}
			return response.formatResponse(response);

		} catch (error) {
			console.error(error)
			throw new Error("Error")
		}
	}

	use(middleware: MiddlewareFunction) {
		this.middleware.push(middleware)
	}

	get(url: string, cb: RouteHandlerCallback) {
		this.availableRoutes.GET.set(url, cb)
	}
	post(url: string, cb: RouteHandlerCallback) {
		this.availableRoutes.POST.set(url, cb)
	}
	put(url: string, cb: RouteHandlerCallback) {
		this.availableRoutes.PUT.set(url, cb)
	}
	delete(url: string, cb: RouteHandlerCallback) {
		this.availableRoutes.DELETE.set(url, cb)
	}

	private async applyMiddleware(request: IHttpRequest, response: IHttpResponse) {
		for (const middleware of this.middleware) {
			await new Promise<void>((resolve) => {
				middleware(request, response, resolve)
			})
		}
	}

	private parseRequest(data: Buffer): IHttpRequest {
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


}
