# Zen-Server

Zen-Server is a lightweight, fast, and flexible HTTP server for Node.js. It provides a simple API for creating web applications with support for middleware, routing, and various parsing options.

## Features

- Easy-to-use API similar to Express.js
- Support for middleware
- Built-in routing for GET, POST, PUT, and DELETE methods
- Optional JSON and Protobuf parsing
- TypeScript support out of the box

## Installation

```bash
npm install zen-server
```

## Quick Start

```javascript
import Zen from 'zen-server';

const app = new Zen();
app.start();

app.get('/', async (req, res) => {
  res.send('Hello, World!');
});

app.post("/post", (req, res) => {
    res.status(200).json({
        success: true
    });
})

app.listen(3000).then(() => {
  console.log('Server running on http://localhost:3000');
});
```

## API

### Creating a server

```javascript
import Zen from 'zen-server';
const app = new Zen();
app.start()
```

### Routing

```javascript
app.get(path, handler)
app.post(path, handler)
app.put(path, handler)
app.delete(path, handler)
```

Example:

```javascript
app.get('/users', async (req, res) => {
  // Handle GET request
});

app.post('/users', (req, res) => {
  // Handle POST request
});
```

### path based async Middleware

```javascript
app.use(middleware, [path])
```


Example:

```javascript
app.use(async (req, res, next) => {
  console.log('Request received:', req.method, req.url);
  await next();
});
```

### Request and Response

The `req` object provides information about the HTTP request:

- `req.method`: The HTTP method of the request
- `req.url`: The URL of the request
- `req.headers`: The headers of the request
- `req.body`: The body of the request (if parsed)

The `res` object provides methods to send the response:

- `res.status(code)`: Set the status code
- `res.send(body)`: Send a response
- `res.json(body)`: Send a JSON response
- `res.append(name, value)`: Append a header

### Parsing

Enable JSON parsing:

```javascript
app.enableJsonParsing();
```

Enable Protobuf parsing (Feauture will be available on v1.1):
```javascript
app.enableProtobufParsing();
```

### Starting the server

```javascript
app.start()
```
Example:
```javascript
app.start(3000).then(() => {
  console.log('Server running on http://localhost:3000');
});
```

### Create clusters of server to handle blocking operation parallely

```javascript
app.enableCluster([NO_OF_WORKERS]);
```

## TypeScript Support

Zen-Server is written in TypeScript and provides type definitions out of the box.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
github : https://github.com/rajgupta-ml/zen-
## License

This project is licensed under the MIT License.
