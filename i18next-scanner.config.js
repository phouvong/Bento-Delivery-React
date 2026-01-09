const fs = require("fs");
const path = require("path");

module.exports = {
    input: [
        "src/**/*.{js,jsx,ts,tsx}",
    ],
    output: "./",
    options: {
        debug: false,
        func: {
            list: ["t", "i18next.t"],
        },
        lngs: ["en"],
        defaultLng: "en",
        defaultValue: (lng, ns, key) => key,
        resource: {
            loadPath: "src/language/{{lng}}.json",
            savePath: "src/language/{{lng}}.json",
        },
        ns: ["translation"],
        defaultNs: "translation",
        keySeparator: false,
        nsSeparator: false,
        removeUnusedKeys: false,
        sort: true,
        trans: false,
    },

    flush: function (done) {
        // The flush function receives the parsed data from the scanner
        // We need to access the parser's data directly
        const parser = this.parser;
        const newKeys = parser.get();

        console.log("🔍 Flush function called");
        console.log("📊 New keys found:", newKeys);

        if (!newKeys || Object.keys(newKeys).length === 0) {
            console.log("📝 No new translation keys found");
            done();
            return;
        }

        const jsFilePath = path.resolve("src/language/en.js");

        try {
            // Read existing JS file if it exists
            let existingKeys = {};
            if (fs.existsSync(jsFilePath)) {
                try {
                    // Read and parse the existing en.js file
                    const fileContent = fs.readFileSync(jsFilePath, "utf8");
                    // Extract the object from the export statement
                    const match = fileContent.match(/export const english = ({[\s\S]*});/);
                    if (match) {
                        // Use eval to parse the object (be careful with this in production)
                        const parsedObject = eval(`(${match[1]})`);
                        // Check if it has nested structure or flat structure
                        if (parsedObject.translation) {
                            // If nested, extract the translation keys
                            existingKeys = parsedObject.translation;
                        } else {
                            // If flat, use as is
                            existingKeys = parsedObject;
                        }
                        console.log(`📖 Read ${Object.keys(existingKeys).length} existing keys from en.js`);
                    }
                } catch (e) {
                    console.warn("⚠️ Could not parse existing en.js, starting fresh");
                    console.warn("Parse error:", e.message);
                }
            }

            // Get the English translations from the new keys (extract from nested structure)
            const englishKeys = (newKeys.en && newKeys.en.translation) ? newKeys.en.translation : (newKeys.en || {});

            // Merge existing keys with new keys (existing keys take precedence)
            const mergedKeys = { ...englishKeys, ...existingKeys };

            // Sort keys alphabetically and remove duplicates
            const sortedKeys = {};
            const uniqueKeys = [...new Set(Object.keys(mergedKeys))];
            uniqueKeys.sort().forEach(key => {
                sortedKeys[key] = mergedKeys[key];
            });

            // Create the JS export format (maintain original flat format)
            const js = `export const english = ${JSON.stringify(sortedKeys, null, 2)};\n`;

            // Write the JS file
            fs.writeFileSync(jsFilePath, js, "utf8");

            const newKeysCount = Object.keys(englishKeys).length;
            const totalKeysCount = Object.keys(sortedKeys).length;
            console.log(`✅ en.js updated! Added ${newKeysCount} new keys. Total: ${totalKeysCount} keys.`);

        } catch (error) {
            console.error("❌ Error processing translation files:", error);
        }

        done();
    },
};