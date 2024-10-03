import { zen } from "./HttpServer";

const server = new zen()
server.start();
server.listen(8080, () => {
	console.log("The server is running on 8080");
}) 
