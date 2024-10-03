import * as net from "net"
export abstract class TcpServer {
	private server?: net.Server;
	start() {
		this.server = net.createServer((socket) => {

			socket.on("connect", () => {
				console.log("The client is connected", socket.remoteAddress);
			})
			socket.on("end", () => {
				console.log("Client disconnected")
			})

			socket.on("error", (error) => {
				console.error(error);
			})

			socket.on("data", (data) => {
				console.log("The request from the client: ", data.toString());
				const response = this.handleRequest(data);
				socket.write(response)
				socket.end();
			})
		})
	}

	listen(PORT: number, cb: () => any) {
		this.server?.listen(PORT, cb())
	}

	abstract handleRequest(data: Buffer): string

}

