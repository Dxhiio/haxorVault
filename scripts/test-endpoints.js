import "dotenv/config";
import axios from "axios";

const API_KEY = process.env.HTB_API_KEY;
const BASE_URL = "https://labs.hackthebox.com/api/v4";

async function testEndpoint(path) {
    try {
        console.log(`Testing ${path}...`);
        const response = await axios.get(`${BASE_URL}${path}`, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });
        console.log(`✅ Success: ${path} (Status: ${response.status})`);
        if (response.data.data) {
            console.log(`   Data length: ${response.data.data.length}`);
        }
        return true;
    } catch (error) {
        console.log(`❌ Failed: ${path} (Status: ${error.response?.status || error.message})`);
        return false;
    }
}

async function runTests() {
    console.log("Testing potential HTB API endpoints for retired machines...");

    const candidates = [
        "/machine/retired",
        "/machine/list",
        "/machines/retired",
        "/machine/paginated?retired=true",
        "/machine/paginated?status=retired",
        "/machine/all",
        "/machines"
    ];

    for (const path of candidates) {
        await testEndpoint(path);
    }
}

runTests();
