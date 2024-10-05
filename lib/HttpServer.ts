import { IHttpRequest, IHttpResponse, MiddlewareFunction, Next, RouteHandlerCallback } from "./Interface.js";
import { ZenRequest } from "./request.js";
import { ZenResponse } from "./response.js";
import { TcpServer } from "./TcpServer.js";



class Zen extends TcpServer {
    private availableRoutes: { [Key: string]: Map<string, RouteHandlerCallback> }
    private middleware: Map<string, MiddlewareFunction[]> = new Map();
    private enableJsonParse: boolean;
    private enableProtobufParse: boolean;
    constructor() {
        super()
        this.availableRoutes = {
            GET: new Map(),
            POST: new Map(),
            PUT: new Map(),
            DELETE: new Map()
        }

        this.enableJsonParse = false;
        this.enableProtobufParse = false;
    }

    async handleRequest(data: Buffer): Promise<string> {
        try {
            const request: IHttpRequest | undefined = new ZenRequest(data, this.enableJsonParse, this.enableProtobufParse).request
            const response: IHttpResponse = new ZenResponse()

            if (!request) throw new Error("Request as not been initalized properly")
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

    use(middleware: MiddlewareFunction, path?: string) {
        const key = path || "all"
        if (this.middleware.has(key)) {
            this.middleware.get(key)?.push(middleware);
        } else {
            this.middleware.set(key, [middleware])
        }
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

    enableJsonParsing() {
        this.enableJsonParse = true;
    }

    enableProtobufParsing() {
        this.enableProtobufParse = true;
    }

    private async applyMiddleware(request: IHttpRequest, response: IHttpResponse) {
        const allMiddleware = this.middleware.get("all") || [];
        const routeBasedMiddleware = this.middleware.get(request.url) || [];
        const combinedMiddleware = [...allMiddleware, ...routeBasedMiddleware];
        const middlewareChain = combinedMiddleware.map((middleware, index) =>
            async (next: Next) => {
                await middleware(request, response, async () => {
                    if (index < combinedMiddleware.length - 1) {
                        await middlewareChain[index + 1](next);
                    } else {
                        await next();
                    }
                });
            }
        );

        if (middlewareChain.length > 0) {
            await middlewareChain[0](() => Promise.resolve());
        }
    }

}

export default Zen;
