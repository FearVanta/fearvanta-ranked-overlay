// =============================================
// PROJECT OBSIDIAN — fv_logic.js (Supabase)
// =============================================
const SUPABASE_URL = "https://efybigjlkignaxvomcgn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeWJpZ2psa2lnbmF4dm9tY2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MjM4NzIsImV4cCI6MjA4NzI5OTg3Mn0.IMp95Z50w7Z2OQut2wvw3BQM7TVCt6UcQmOJbOijA8o";

const HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`
};

// Base path for icons on Vercel
const ICON_BASE = "/FearVanta-Ranked-Overlay/overlay/assets/icons";

const TIERS = [
    { name: "Bronze I",     min: 0,     max: 300,   icon: "bronze",     color: "#b87333" },
    { name: "Bronze II",    min: 300,   max: 600,   icon: "bronze",     color: "#b87333" },
    { name: "Bronze III",   min: 600,   max: 900,   icon: "bronze",     color: "#b87333" },
    { name: "Silver I",     min: 900,   max: 1300,  icon: "silver",     color: "#c0c0c0" },
    { name: "Silver II",    min: 1300,  max: 1700,  icon: "silver",     color: "#c0c0c0" },
    { name: "Silver III",   min: 1700,  max: 2100,  icon: "silver",     color: "#c0c0c0" },
    { name: "Gold I",       min: 2100,  max: 2600,  icon: "gold",       color: "#ffd700" },
    { name: "Gold II",      min: 2600,  max: 3100,  icon: "gold",       color: "#ffd700" },
    { name: "Gold III",     min: 3100,  max: 3600,  icon: "gold",       color: "#ffd700" },
    { name: "Platinum I",   min: 3600,  max: 4200,  icon: "platinum",   color: "#4fd3ff" },
    { name: "Platinum II",  min: 4200,  max: 4800,  icon: "platinum",   color: "#4fd3ff" },
    { name: "Platinum III", min: 4800,  max: 5400,  icon: "platinum",   color: "#4fd3ff" },
    { name: "Diamond I",    min: 5400,  max: 6100,  icon: "diamond",    color: "#4a90ff" },
    { name: "Diamond II",   min: 6100,  max: 6800,  icon: "diamond",    color: "#4a90ff" },
    { name: "Diamond III",  min: 6800,  max: 7500,  icon: "diamond",    color: "#4a90ff" },
    { name: "Crimson I",    min: 7500,  max: 8300,  icon: "crimson",    color: "#ff3b3b" },
    { name: "Crimson II",   min: 8300,  max: 9100,  icon: "crimson",    color: "#ff3b3b" },
    { name: "Crimson III",  min: 9100,  max: 10000, icon: "crimson",    color: "#ff3b3b" },
    { name: "Iridescent",   min: 10000, max: 99999, icon: "iridescent", color: "#b44cff" },
];

function getTierFromSR(sr, pos) {
    if (sr >= 10000 && pos >= 1 && pos <= 250) {
        return { name: `Top 250 · #${pos}`, icon: "top250", color: "#ffffff" };
    }
    return TIERS.find(t => sr >= t.min && sr < t.max) || TIERS[0];
}

const BACKGROUNDS = {
    "classic-dark":  (o) => `rgba(10,10,10,${o})`,
    "dark-glass":    (o) => `rgba(20,20,30,${o})`,
    "neon-grid":     (o) => `rgba(0,20,30,${o})`,
    "cyber-wave":    (o) => `rgba(0,10,40,${o})`,
    "matrix":        (o) => `rgba(0,15,0,${o})`,
    "aurora":        (o) => `rgba(15,0,40,${o})`,
    "crimson-flame": (o) => `rgba(30,0,0,${o})`,
    "frozen-ice":    (o) => `rgba(0,20,40,${o})`,
    "marble-white":  (o) => `rgba(240,240,245,${o})`
};

let lastIcon = null;
let lastUpdatedAt = null;

function applyConfig(data) {
    const sr = parseInt(data.sr) || 0;
    const pos = parseInt(data.leaderboard_pos) || 0;
    const opacity = parseFloat(data.opacity) ?? 0.85;
    const tier = getTierFromSR(sr, pos);

    // Username
    document.getElementById("username").textContent = data.username || "@fearvanta";

    // Rank text
    document.getElementById("rankText").textContent = tier.name;

    // SR value
    document.getElementById("srValue").textContent = sr.toLocaleString();

    // Rank color
    document.documentElement.style.setProperty("--rank-color", tier.color);

    // Icon — only reload video if rank changed
    if (tier.icon !== lastIcon) {
        lastIcon = tier.icon;
        const video = document.getElementById("rankIcon");
        const source = video.querySelector("source");
        source.src = `${ICON_BASE}/${tier.icon}.webm`;
        video.load();
        video.play().catch(() => {});
    }

    // Layout
    document.getElementById("overlay").className = data.layout === "vertical" ? "vertical" : "";

    // Background
    const bgFn = BACKGROUNDS[data.background] || BACKGROUNDS["classic-dark"];
    document.getElementById("overlayBg").style.background = bgFn(opacity);
}

async function pollConfig() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/overlay_config?id=eq.1`, {
            headers: HEADERS
        });
        const data = await res.json();
        if (data && data[0]) {
            // Only re-apply if something changed
            if (data[0].updated_at !== lastUpdatedAt) {
                lastUpdatedAt = data[0].updated_at;
                applyConfig(data[0]);
            }
        }
    } catch(e) {
        console.log("Poll error:", e);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    pollConfig();
    setInterval(pollConfig, 3000);
});
