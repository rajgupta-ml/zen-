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


export type Next = () => Promise<void> | void
export type RouteHandlerCallback = (request: IHttpRequest, response: IHttpResponse) => Promise<void> | void
export type MiddlewareFunction = (request: IHttpRequest, response: IHttpResponse, next: Next) => Promise<void> | void

