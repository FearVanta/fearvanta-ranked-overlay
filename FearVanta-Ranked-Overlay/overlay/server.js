const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".webm": "video/webm",
    ".webp": "image/webp",
    ".ico": "image/x-icon"
};

http.createServer((req, res) => {
    const allowOrigin = (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        allowOrigin(res);
        res.writeHead(204);
        res.end();
        return;
    }

    // Handle POST to /save — writes overlay.json
    if (req.method === "POST" && req.url === "/save") {
        allowOrigin(res);
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const data = JSON.parse(body);
                const jsonPath = path.join(ROOT, "config", "overlay.json");
                fs.writeFileSync(jsonPath, JSON.stringify(data, null, 4));
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: true }));
                console.log("[SAVE] overlay.json updated — SR:", data.sr, "| User:", data.username);
            } catch (e) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: e.message }));
            }
        });
        return;
    }

    // Serve static files
    let urlPath = req.url.split("?")[0];
    if (urlPath === "/" || urlPath === "") urlPath = "/fv_overlay.html";

    const filePath = path.join(ROOT, urlPath);

    fs.readFile(filePath, (err, data) => {
        allowOrigin(res);
        if (err) {
            res.writeHead(404);
            res.end("Not found");
            return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
    });

}).listen(PORT, () => {
    console.log(`FearVanta server running at http://localhost:${PORT}`);
});
