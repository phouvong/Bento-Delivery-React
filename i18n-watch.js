const chokidar = require("chokidar");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("👀 Starting i18n watcher...");

// Check if required directories exist
const srcExists = fs.existsSync(path.join(__dirname, "src"));
const appExists = fs.existsSync(path.join(__dirname, "app"));

console.log(`📁 src directory exists: ${srcExists}`);
console.log(`📁 app directory exists: ${appExists}`);

// Build watch patterns based on existing directories
const watchPatterns = [];
if (srcExists) {
    watchPatterns.push("src/**/*.{js,jsx,ts,tsx}");
}
if (appExists) {
    watchPatterns.push("app/**/*.{js,jsx,ts,tsx}");
}

if (watchPatterns.length === 0) {
    console.error("❌ No valid directories to watch found!");
    process.exit(1);
}

console.log("📂 Watching patterns:", watchPatterns);

const watcher = chokidar.watch(watchPatterns, {
    ignored: [/node_modules/, /\.git/, /\.next/, /\.DS_Store/, /src\/language/],
    persistent: true,
    usePolling: true, // Force polling for better compatibility
    interval: 1000, // Check every second
    ignoreInitial: true,
    awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 200
    },
    atomic: true // Handle atomic writes better
});

watcher.on("ready", () => {
    console.log("✅ Watcher ready and monitoring files...");
});

watcher.on("error", (error) => {
    console.error("❌ Watcher error:", error);
});

watcher.on("change", (filePath) => {
    console.log(`📄 File changed: ${filePath}`);
    console.log(`🕐 Timestamp: ${new Date().toLocaleTimeString()}`);
    runScanner();
});

watcher.on("add", (filePath) => {
    console.log(`📄 File added: ${filePath}`);
    console.log(`🕐 Timestamp: ${new Date().toLocaleTimeString()}`);
    runScanner();
});

watcher.on("unlink", (filePath) => {
    console.log(`📄 File removed: ${filePath}`);
});

function runScanner() {
    // Add debouncing to prevent multiple rapid executions
    clearTimeout(watcher.debounceTimer);
    watcher.debounceTimer = setTimeout(() => {
        console.log("🔄 Running i18n scan...");

        exec("node i18n-scan.js", { cwd: __dirname }, (err, stdout, stderr) => {
            if (err) {
                console.error("❌ Error running i18n scan:", err.message);
                return;
            }

            if (stderr) {
                console.warn("⚠️ Scanner warnings:", stderr);
            }

            if (stdout) {
                console.log("📝 Scanner output:", stdout);
            }

            console.log("✅ Translations scan completed!");
        });
    }, 300); // Reduced debounce time
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log("\n🛑 Shutting down watcher...");
    watcher.close();
    process.exit(0);
});

console.log("🎯 Watcher initialized. Make changes to files to test...");
