import * as net from "net"
export abstract class TcpServer {
	private server?: net.Server;
	private socket?: net.Socket;
	start() {
		this.server = net.createServer((socket) => {
			console.log("A new TCP connection is created")
			socket.on("connect", () => {
				this.setSocket(socket)
				console.log("The client is connected", socket.remoteAddress);
			})
			socket.on("end", () => {
				console.log("Client disconnected")
			})

			socket.on("error", (error) => {
				console.error(error);
			})

			socket.on("data", (data) => {
				const response = this.handleRequest(data);
				socket.write(response);
			})

		})
	}

	abstract handleRequest(data: Buffer): string

	listen(PORT: number, cb: () => any) {
		this.server?.listen(PORT, cb)
	}


	getSocket(): net.Socket {
		if (!this.socket) throw new Error("Server is not initialized");
		return this.socket;
	}

	setSocket(socket: net.Socket) {
		console.log("Socket has been initalized")
		this.socket = socket
	}


}

