import { IHttpResponse } from "./Interface";

export class ZenResponse implements IHttpResponse {

	private status_code: number = 200;
	private headers: Record<string, any> = {}
	private body: string = "";


	status(status_code: number): IHttpResponse {
		if (this.status_code < 100 || this.status_code > 599) {
			throw new Error("Invalid Http response");
		}

		this.status_code = status_code;
		return this
	}

	json(data: Record<string, any>): void {
		this.headers['Content-Type'] = 'application/json';
		this.body = JSON.stringify(data);
	}

	send(data: string): void {
		if (!this.headers['Content-Type']) {
			this.headers['Content-Type'] = 'text/plain';
		}
		this.body = data;
	}
	append(headers_key: string, header_value: string | string[]): void {
		if (!headers_key || !header_value) {
			throw new Error("Header values are not set properly");
		}

		this.headers[headers_key] = header_value
	}

	getStatusCode() {
		return this.status_code;
	}

	getHeaders() {
		return this.headers;
	}

	getBody() {
		return this.body;
	}

	formatResponse(response: IHttpResponse): string {
		let responseString = `HTTP/1.1 ${response.getStatusCode()} ${this.getStatusText(response.getStatusCode())}\r\n`;
		const headers = response.getHeaders();
		for (const [key, value] of Object.entries(headers)) {
			responseString += `${key}: ${value}\r\n`;
		}
		const body = response.getBody();
		responseString += `Content-Length: ${Buffer.byteLength(body)}\r\n`;
		responseString += '\r\n';
		responseString += body;
		return responseString;

	}

	private getStatusText(statusCode: number): string {
		const statusTexts: { [key: number]: string } = {
			200: 'OK',
			201: 'Created',
			204: 'No Content',
			400: 'Bad Request',
			401: 'Unauthorized',
			403: 'Forbidden',
			404: 'Not Found',
			500: 'Internal Server Error',
		};
		return statusTexts[statusCode] || 'Unknown Status';
	}
}
