const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = 8080;
const ROOT = __dirname;

const GITHUB_RAW = "https://raw.githubusercontent.com/FearVanta/fearvanta-ranked-overlay/main";
const VERSION_FILE = path.join(ROOT, "version.json");

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

// -----------------------------------------------
// AUTO UPDATER
// -----------------------------------------------
let updateStatus = { available: false, version: null };
function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { "User-Agent": "FearVanta-Overlay" } }, res => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                return httpsGet(res.headers.location).then(resolve).catch(reject);
            }
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => resolve(data));
        }).on("error", reject);
    });
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, { headers: { "User-Agent": "FearVanta-Overlay" } }, res => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                file.close();
                return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
            }
            res.pipe(file);
            file.on("finish", () => file.close(resolve));
        }).on("error", err => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function checkForUpdates() {
    console.log("[UPDATE] Checking for updates...");
    try {
        const remoteRaw = await httpsGet(`${GITHUB_RAW}/version.json`);
        const remote = JSON.parse(remoteRaw);

        let local = { version: "0.0.0", files: [] };
        if (fs.existsSync(VERSION_FILE)) {
            local = JSON.parse(fs.readFileSync(VERSION_FILE, "utf8"));
        }

        if (remote.version === local.version) {
            console.log(`[UPDATE] Already up to date (v${local.version})`);
            return;
        }

        console.log(`[UPDATE] New version found: v${remote.version} (current: v${local.version})`);
        console.log("[UPDATE] Downloading updates...");

        for (const file of remote.files) {
            const dest = path.join(ROOT, file);
            await downloadFile(`${GITHUB_RAW}/${file}`, dest);
            console.log(`[UPDATE] Updated: ${file}`);
        }

        // Save new version.json
        fs.writeFileSync(VERSION_FILE, JSON.stringify(remote, null, 4));
        console.log(`[UPDATE] Successfully updated to v${remote.version}!`);
        updateStatus = { available: true, version: remote.version };

    } catch (e) {
        console.log("[UPDATE] Could not check for updates (no internet or GitHub unavailable)");
    }
}

// -----------------------------------------------
// HTTP SERVER
// -----------------------------------------------
http.createServer((req, res) => {
    const allowOrigin = (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    };

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

    // Return update status to dock
    if (req.method === "GET" && req.url === "/update-status") {
        allowOrigin(res);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updateStatus));
        return;
    }

    // Clear update status once dock has seen it
    if (req.method === "POST" && req.url === "/update-seen") {
        allowOrigin(res);
        updateStatus = { available: false, version: null };
        res.writeHead(200);
        res.end();
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
    console.log(`FearVanta Overlay server running at http://localhost:${PORT}`);
    // Check for updates on startup
    checkForUpdates();
    // Check for updates every 2 hours while running
    setInterval(checkForUpdates, 2 * 60 * 60 * 1000);
});
