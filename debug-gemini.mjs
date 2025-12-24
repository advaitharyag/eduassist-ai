import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Manually read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = null;

try {
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        if (match && match[1]) {
            apiKey = match[1].trim();
        }
    }
} catch (e) {
    console.error("Error reading .env.local", e);
}

if (!apiKey) {
    console.error("API Key not found in .env.local.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    const output = {
        test_model: "gemini-1.5-flash",
        success: false,
        error: null,
        available_models: []
    };

    console.log("Testing gemini-1.5-flash...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test connection");
        output.success = true;
        console.log("Success!");
    } catch (error) {
        console.error("Failed:", error.message);
        output.error = error.message;

        console.log("Listing models...");
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (response.ok) {
                const data = await response.json();
                if (data.models) {
                    output.available_models = data.models
                        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                        .map(m => m.name);
                }
            } else {
                const txt = await response.text();
                console.log("List failed:", txt);
                output.list_error_details = txt;
            }
        } catch (e) {
            output.list_error = e.message;
        }
    }

    fs.writeFileSync('debug_models.json', JSON.stringify(output, null, 2));
}

run();
