const { createServer, IncomingMessage, ServerResponse } = require("http");
const { parse, UrlWithParsedQuery } = require("url");
const next = require("next");
const { initSocketIO } = require("./lib/socketio");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = createServer(
		(req: typeof IncomingMessage, res: typeof ServerResponse) => {
			const parsedUrl = req.url ? parse(req.url, true) : null;
			if (parsedUrl) {
				handle(req, res, parsedUrl as typeof UrlWithParsedQuery);
			} else {
				res.writeHead(400);
				res.end("Invalid URL");
			}
		}
	);

	// Initialize Socket.IO
	initSocketIO(server);

	server.listen(3000, () => {
		console.log(`> Ready on ${process.env.SITE_URL}`);
	});
});
