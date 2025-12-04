
import "dotenv/config";
import axios from "axios";

// Configuration
const API_KEY = process.env.HTB_API_KEY?.replace(/"/g, '');

if (!API_KEY) {
    console.error("Error: HTB_API_KEY is not defined in .env");
    process.exit(1);
}

const BASE_URL = "https://labs.hackthebox.com/api/v4";

async function checkProfile() {
    try {
        console.log("🔍 Checking HTB Profile...");
        
        // 1. Get My Profile
        // This endpoint usually returns the authenticated user's info
        const response = await axios.get(`${BASE_URL}/user/info`, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "User-Agent": "Mozilla/5.0"
            }
        });

        const user = response.data.info;
        console.log(`\n👤 User: ${user.name}`);
        console.log(`🆔 ID: ${user.id}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🏆 Rank: ${user.rank}`);
        console.log(`💻 Owns: System=${user.system_owns}, User=${user.user_owns}`);

        // 2. Get Solved Machines (if possible)
        // There isn't a simple "list all solved machines" endpoint in v4 public API usually, 
        // but let's try to see if we can get activity or progress.
        // Often we have to iterate or check specific endpoints.
        
        console.log("\nTrying to fetch progress...");
        
        // Try to get user's machine progress
        // Note: This endpoint might vary or require different permissions
        try {
             const progressResponse = await axios.get(`${BASE_URL}/profile/progress/machines/${user.id}`, {
                headers: { "Authorization": `Bearer ${API_KEY}` }
            });
            console.log("Progress Data:", progressResponse.data);
        } catch (err) {
            console.log("Could not fetch direct machine progress list (might need different endpoint).");
        }

    } catch (error) {
        console.error("❌ Error fetching profile:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

checkProfile();
