import "dotenv/config";
import fetch from "node-fetch";

// HTB API key
const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiNmFiYjRkZTdlNjBkYjZjNGVhZWNiNGYzZTllZDhmMGQ4Y2ZiYjUxMDg4MGFhN2ZhNTdhOGVhZmVlYzQ4MGI0NTUzMDhmMzhlMTFkOTM4YjUiLCJpYXQiOjE3NjQzMzcxNzcuMjk0MzcxLCJuYmYiOjE3NjQzMzcxNzcuMjk0MzczLCJleHAiOjE3NjQ0MjM1NzcuMjc4ODU0LCJzdWIiOiIxMjM1MDgzIiwic2NvcGVzIjpbXX0.PpoC8kY0ASChKjwOVtm0Lrwkq0Z13FW6dcwubnLqjph8PdKpczk4_esAtLMd1Rx2JrTEgrZORbETy0Qtr-N3jSjtiDkDGcklV1Gaqs4S-gSlAc91D_VbGierwt3IWSRPTgKGqNpzN5JcbJOIPzCmbt6049xcSm5Ucc4FCDTcSoCETnR0l01bRx5Y-4sRsqF2icJCOlN5Nsu9RMxTrJcgz5h0PhYglWyiCfW4WwCfmC0oOxa0YemlyxPfkPXbghoCit4HMe5nmKrsnX8DSoT2nuxRqEWniGAykuz7AW2Jei1GSoqCCU4JjfcfM1EOG3ZZY78-2LyDkmvHzHZo_izNekBApq5DBIkLepUZMjjRbmHKId5Ll_u0z_UUlHdfT61QhLQ3sSueIdhzdwyeCb_rWeWg5uY1zmmcD4dvi62EXXkEhS6kr9Rbdi8XYNt-nLfKoxuULkaOqjCq6IFw6ObvzyTi3vmSLpm03e-QNffs5e3p4dOMT5DLjV8uGx2D5cLwXsBNTFtQKVHDNY0YkNqvWnOXFthMLMkUhIK7EATjfxKVBHwh3nkOAnuqer7Y4lx3dRfeai9SHw15Mu_AYg26bwfAHlKqYinKwS-7YbBt_kBDjOdwjSVV7SvR1dZ3llxZSSvdj14cyy_DOVRR7IEv082G9fP0Vbi6qev0u2r4jD4";

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
