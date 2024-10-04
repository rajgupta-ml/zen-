import { zen } from "./HttpServer";
import { IHttpRequest, IHttpResponse } from "./Interface";



const printNameMiddleware = (request: IHttpRequest, response: IHttpResponse, next: () => void) => {
	console.log("hello this is the middle ware");
	console.log(request)
	next()
}

const zenServer = new zen()
zenServer.start();
zenServer.use(printNameMiddleware)
const fn = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve()
		}, 1000);
	})
}
zenServer.get("/", async (request: IHttpRequest, response: IHttpResponse) => {
	await fn()
	response.status(200).send("Hello world")
})
zenServer.listen(8080, () => {
	console.log("The server is running on 8080");
})


