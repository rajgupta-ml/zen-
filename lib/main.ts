import { zen } from "./HttpServer";
import { IHttpRequest, IHttpResponse } from "./Interface";

const zenServer = new zen()
zenServer.start();

zenServer.get("/", (request: IHttpRequest, response: IHttpResponse) => {
	console.log(request)
	response.status(200).send("hello World")
})
zenServer.listen(8080, () => {
	console.log("The server is running on 8080");
})


