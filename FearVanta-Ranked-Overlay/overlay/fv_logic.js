let lastSR = null;
let lastIcon = null;

const tiers = [
    { min: 0, max: 300, name: "Bronze I", rank: "Bronze", icon: "bronze.webm", color: "#b87333" },
    { min: 300, max: 600, name: "Bronze II", rank: "Bronze", icon: "bronze.webm", color: "#b87333" },
    { min: 600, max: 900, name: "Bronze III", rank: "Bronze", icon: "bronze.webm", color: "#b87333" },

    { min: 900, max: 1300, name: "Silver I", rank: "Silver", icon: "silver.webm", color: "#c0c0c0" },
    { min: 1300, max: 1700, name: "Silver II", rank: "Silver", icon: "silver.webm", color: "#c0c0c0" },
    { min: 1700, max: 2100, name: "Silver III", rank: "Silver", icon: "silver.webm", color: "#c0c0c0" },

    { min: 2100, max: 2600, name: "Gold I", rank: "Gold", icon: "gold.webm", color: "#ffd700" },
    { min: 2600, max: 3100, name: "Gold II", rank: "Gold", icon: "gold.webm", color: "#ffd700" },
    { min: 3100, max: 3600, name: "Gold III", rank: "Gold", icon: "gold.webm", color: "#ffd700" },

    { min: 3600, max: 4200, name: "Platinum I", rank: "Platinum", icon: "platinum.webm", color: "#4fd3ff" },
    { min: 4200, max: 4800, name: "Platinum II", rank: "Platinum", icon: "platinum.webm", color: "#4fd3ff" },
    { min: 4800, max: 5400, name: "Platinum III", rank: "Platinum", icon: "platinum.webm", color: "#4fd3ff" },

    { min: 5400, max: 6100, name: "Diamond I", rank: "Diamond", icon: "diamond.webm", color: "#4a90ff" },
    { min: 6100, max: 6800, name: "Diamond II", rank: "Diamond", icon: "diamond.webm", color: "#4a90ff" },
    { min: 6800, max: 7500, name: "Diamond III", rank: "Diamond", icon: "diamond.webm", color: "#4a90ff" },

    { min: 7500, max: 8300, name: "Crimson I", rank: "Crimson", icon: "crimson.webm", color: "#ff3b3b" },
    { min: 8300, max: 9100, name: "Crimson II", rank: "Crimson", icon: "crimson.webm", color: "#ff3b3b" },
    { min: 9100, max: 10000, name: "Crimson III", rank: "Crimson", icon: "crimson.webm", color: "#ff3b3b" },

    { min: 10000, max: 99999, name: "Iridescent", rank: "Iridescent", icon: "iridescent.webm", color: "#b44cff" },
    { min: 99999, max: 999999, name: "Top 250", rank: "Top 250", icon: "top250.webm", color: "#ffffff" }
];

function getTierFromSR(sr, leaderboardPos) {
    // If SR >= 10000 and has a valid leaderboard position (1-250), show Top 250
    if (sr >= 10000 && leaderboardPos && leaderboardPos >= 1 && leaderboardPos <= 250) {
        return tiers.find(t => t.name === "Top 250");
    }
    return tiers.find(t => sr >= t.min && sr < t.max) || tiers[0];
}

async function loadData() {
    try {
        const res = await fetch("config/overlay.json?cache=" + Date.now());
        const data = await res.json();
        updateOverlay(data);
    } catch (e) {
        console.error("Error loading overlay.json", e);
    }
}

function updateOverlay(data) {
    const srValue  = document.getElementById("srValue");
    const srChange = document.getElementById("srChange");
    const rankIcon = document.getElementById("rankIcon");
    const rankText = document.getElementById("rankText");
    const username = document.getElementById("username");
    const overlay  = document.getElementById("overlay");

    const sr            = data.sr ?? 0;
    const name          = data.username ?? "@USERNAME";
    const opacity       = data.opacity ?? 0.85;
    const bgPreset      = data.background ?? "classic-dark";
    const leaderboardPos = data.leaderboard_pos ?? 0;

    username.textContent = name;
    srValue.textContent  = sr;

    const tier = getTierFromSR(sr, leaderboardPos);

    if (tier.name === "Top 250" && leaderboardPos >= 1) {
        rankText.textContent = `Top 250 · #${leaderboardPos}`;
    } else {
        rankText.textContent = tier.name;
    }

    // Only reload the video when the icon actually changes rank
    const rankIconSource = document.getElementById("rankIconSource");
    const newSrc = `assets/icons/${tier.icon}`;
    if (lastIcon !== tier.icon) {
        rankIconSource.src = newSrc;
        rankIcon.load();
        lastIcon = tier.icon;
    }

    overlay.style.setProperty("--bg-opacity", opacity);
    overlay.style.setProperty("--rank-color", tier.color);

    const layout = data.layout ?? "horizontal";
    overlay.className = `${bgPreset}${layout === "vertical" ? " vertical" : ""}`;

    lastSR = sr;

    // ⭐ VERSION AUTO‑UPDATE
    if (data.version) {
        const versionEl = document.getElementById("fvVersion");
        if (versionEl) {
            versionEl.textContent = "v" + data.version;
        }
    }
}

setInterval(loadData, 500);
loadData();
