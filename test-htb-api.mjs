import "dotenv/config";
import fetch from "node-fetch";

// HTB API key
const API_KEY = process.env.HTB_API_KEY;

if (!API_KEY) {
  console.error("Error: HTB_API_KEY not set in .env");
  process.exit(1);
}

async function testHTBAPI() {
  try {
    console.log("Testing HTB API access...");

    const response = await fetch("https://api.hackthebox.com/machines", {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("HTB API Response:", JSON.stringify(data, null, 2));

    // Show some sample data
    console.log("\nSample machine data:");
    if (data && data.machines && data.machines.length > 0) {
      console.log(JSON.stringify(data.machines[0], null, 2));
    }

    return data;
  } catch (error) {
    console.error("Error testing HTB API:", error);
    throw error;
  }
}

testHTBAPI();
