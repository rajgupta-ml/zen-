export interface IHttpRequest {

	method: string,
	url: string,
	headers: { [Key: string]: string };
	body?: string
}

export interface IHttpResponse {
	status(status_code: number): IHttpResponse;
	json(data: Record<string, any>): void
	send(data: string): void
	append(headers_key: string, header_value: string | string[]): void
	getStatusCode(): number;
	getHeaders(): Record<string, any>
	getBody(): string
	formatResponse(response: IHttpResponse): string
}

