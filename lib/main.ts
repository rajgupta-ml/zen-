import path from "path";
import { zen } from "./HttpServer";
import { IHttpRequest, IHttpResponse, Next } from "./Interface";

// Async Middleware
const globalMiddleware = async (request: IHttpRequest, response: IHttpResponse, next: Next) => {
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log("hello this is the global middleware");
            resolve();
        }, 1000);
    });
    await next();
};

const localMiddleware = async (request: IHttpRequest, response: IHttpResponse, next: Next) => {
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log("hello this is the local middleware");
            resolve();
        }, 1000);
    });
    await next();
};
const zenServer = new zen()
zenServer.enableJsonParsing();
zenServer.start();
zenServer.use(globalMiddleware)
zenServer.use(localMiddleware,"/hello")
const fn = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve()
		}, 1000);
	})
}
zenServer.get("/", (request, response) => {
		response.status(200).send("Hello World");
})

zenServer.listen(8080, () => {
	console.log("The server is running on 8080");
})


