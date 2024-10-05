import { IHttpRequest } from "./Interface";

export class ZenRequest {
    private data: Buffer;
    private enableJsonParse: boolean;
    private enableProtobufParse: boolean;
    request?: IHttpRequest;

    constructor(data: Buffer, enableJsonParse: boolean, enableProtobufParse: boolean) {
        this.data = data;
        this.enableJsonParse = enableJsonParse;
        this.enableProtobufParse = enableProtobufParse;
        this.parseRequest();
    }

    private parseRequest(): void {
        const [headersString, body] = this.data.toString().split("\r\n\r\n");
        const [requestLines, ...headerLines] = headersString.split("\r\n");
        const [method, url] = requestLines.split(" ");
        const headers: { [Key: string]: string } = {};

        for (const line of headerLines) {
            const [key, value] = line.split(": ");
            headers[key.toLowerCase()] = value;
        }

        if (this.enableJsonParse && this.enableProtobufParse) {
            throw new Error("JSON Parsing and Protobuf parsing both are enabled");
        }

        if (this.enableJsonParse) {
            // Check if the body is a valid JSON string
            try {
                this.request = { method, url, headers, body: JSON.parse(body) };
            } catch (e) {
                // If parsing fails, treat the body as a plain string
                this.request = { method, url, headers, body };
            }
        } else if (this.enableProtobufParse) {
            // Do some protobuf parsing
        } else {
            this.request = { method, url, headers, body };
        }
    }
}
