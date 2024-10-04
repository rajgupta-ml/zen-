import * as net from "net"
export abstract class TcpServer {
	private server?: net.Server;
	private socket?: net.Socket;
	private socketCache: Map<string, net.Socket> = new Map()
	start() {
		this.server = net.createServer((socket) => {
			const Key = `${socket.remoteAddress}:${socket.localPort}`
			this.socketCache.set(Key, socket)
			socket.on("end", () => {
				this.socketCache.delete(Key)
				console.log("Client disconnected")
			})

			socket.on("error", (error) => {
				this.socketCache.delete(Key);
				console.error(error);
			})

			socket.on("data", async (data) => {
				const response = await this.handleRequest(data);
				socket.write(response)
				// This is a default behaviour of the header Connection : close
				// if the TCP needs to be alive then Keep alive header will be given.
				if (this.keepSocketAlive(data.toString())) {
					console.log("Connection is alive");
				} else {
					socket.end()
					this.socketCache.delete(Key)

				}
			})

		})
	}

	abstract handleRequest(data: Buffer): Promise<string>

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

	keepSocketAlive(data: string): boolean {
		return data.toLowerCase().includes("connection: keep-alive")
	}


}

