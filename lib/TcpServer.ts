import * as net from "net"
import cluster from "cluster"
import os from "os"
export abstract class TcpServer {
	private server?: net.Server;
	private socketCache: Map<string, net.Socket> = new Map()
	private clusterEnabled: boolean = false
	private NO_OF_WORKER: number = 0;
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


	listen(PORT: number, cb: () => any) {
		if (this.clusterEnabled) {
			if (cluster.isPrimary) {
				console.log("The cluster mode is enabled")
				console.log("Master process PID:", process.pid);
				console.warn("This is stateless mechcanism memory is not shared between mutiple clusters")
				for (let worker = 0; worker < this.NO_OF_WORKER; worker++) {
					cluster.fork();
				}
			} else {
				console.log("Worker process PID: ", process.pid);
				this.server?.listen(PORT, cb)

			}
		} else {
			this.server?.listen(PORT, cb)

		}
	}


	enableCluster(clusters: number = os.cpus().length) {
		this.clusterEnabled = true
		this.NO_OF_WORKER = clusters
	}

	private keepSocketAlive(data: string): boolean {
		return data.toLowerCase().includes("connection: keep-alive")
	}


	abstract handleRequest(data: Buffer): Promise<string>

}

