import "dotenv/config";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// Configuration
const API_KEY = process.env.HTB_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!API_KEY) {
    console.error("Error: HTB_API_KEY is not defined");
    process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Error: Supabase configuration is missing");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Constants
const BASE_URL = "https://labs.hackthebox.com/api/v4";
const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests
const MAX_RETRIES = 3;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeApiRequest(url, retries = 0) {
    try {
        console.log(`Requesting: ${url}`); // Log the request
        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0" // Add User-Agent to mimic browser
            },
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 429 && retries < MAX_RETRIES) {
            const delay = RATE_LIMIT_DELAY * Math.pow(2, retries + 1); // Exponential backoff
            console.warn(`Rate limited. Retrying in ${delay}ms... (attempt ${retries + 1})`);
            await sleep(delay);
            return makeApiRequest(url, retries + 1);
        }
        throw error;
    }
}

async function fetchMachines(endpoint, status) {
    let allMachines = [];
    let page = 1;
    let hasMore = true;

    console.log(`Starting fetch for ${status} machines...`);

    while (hasMore) {
        try {
            console.log(`Fetching page ${page} for ${status} machines...`);
            const data = await makeApiRequest(`${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}per_page=100&page=${page}`);

            if (data && data.data && data.data.length > 0) {
                allMachines = allMachines.concat(data.data);
                console.log(`Retrieved ${data.data.length} machines. Total: ${allMachines.length}`);

                if (data.data.length < 100) {
                    hasMore = false;
                } else {
                    page++;
                    await sleep(RATE_LIMIT_DELAY);
                }
            } else {
                hasMore = false;
            }
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error.message);
            hasMore = false;
        }
    }

    return allMachines;
}

async function getMachineDetails(id) {
    try {
        // User suggested using /machine/info/{id}
        const data = await makeApiRequest(`https://www.hackthebox.com/api/v4/machine/info/${id}`);
        return data.info || data.data || null;
    } catch (error) {
        console.error(`Error fetching details for machine ${id}:`, error.message);
        return null;
    }
}

async function ensureBucketExists() {
    // Bucket creation is no longer strictly necessary if we are just storing URLs, 
    // but keeping it doesn't hurt.
    const { data, error } = await supabase.storage.getBucket('machines');
    if (error && error.message.includes('not found')) {
        console.log("Creating 'machines' bucket...");
        const { data: bucket, error: createError } = await supabase.storage.createBucket('machines', {
            public: true
        });
        if (createError) {
            console.error("Error creating bucket:", createError);
            return false;
        }
        return true;
    }
    return true;
}

async function syncMachines() {
    try {
        await ensureBucketExists();

        // 1. Fetch Active Machines
        const activeMachines = await fetchMachines("/machine/paginated", "active");

        // 2. Fetch Retired Machines
        const retiredMachines = await fetchMachines("/machine/list/retired/paginated", "retired");

        const allMachines = [
            ...activeMachines.map(m => ({ ...m, status_override: 'active' })),
            ...retiredMachines.map(m => ({ ...m, status_override: 'retired' }))
        ];

        console.log(`Total machines to process: ${allMachines.length}`);

        let processedCount = 0;
        let errorCount = 0;

        for (const machine of allMachines) {
            try {
                // Fetch details to get IP and other metadata if missing
                // Reduced delay slightly, relying on exponential backoff in makeApiRequest
                await sleep(500);
                const details = await getMachineDetails(machine.id);

                const machineData = details || machine;

                // Handle Image URL - Direct S3 Link
                let avatarUrl = machineData.avatar;

                console.log(`Machine: ${machineData.name} (${machineData.id}) - Original Avatar: ${avatarUrl}`);

                if (machineData.avatar && !machineData.avatar.startsWith('http')) {
                    avatarUrl = `https://htb-mp-prod-public-storage.s3.eu-central-1.amazonaws.com${machineData.avatar}`;
                    console.log(`  -> Resolved S3 URL: ${avatarUrl}`);
                }

                const record = {
                    id: machineData.id,
                    name: machineData.name,
                    os: machineData.os,
                    ip: machineData.ip,
                    avatar: avatarUrl,
                    points: machineData.points,
                    difficulty_text: machineData.difficultyText || machineData.difficulty_text,
                    status: machine.status_override,
                    release_date: machineData.release,
                    user_owns_count: machineData.user_owns_count,
                    root_owns_count: machineData.root_owns_count,
                    free: machineData.free,
                    stars: machineData.stars,
                    last_updated: new Date().toISOString()
                };

                const { error } = await supabase
                    .from('htb_machines')
                    .upsert(record, { onConflict: 'id' });

                if (error) {
                    console.error(`Error upserting machine ${machine.name}:`, error.message);
                    errorCount++;
                } else {
                    processedCount++;
                    if (processedCount % 10 === 0) {
                        process.stdout.write(`\rProcessed: ${processedCount}/${allMachines.length}`);
                    }
                }

            } catch (err) {
                console.error(`Error processing machine ${machine.id}:`, err.message);
                errorCount++;
            }
        }

        console.log(`\nSync completed.`);
        console.log(`Success: ${processedCount}`);
        console.log(`Errors: ${errorCount}`);

    } catch (error) {
        console.error("Fatal error during sync:", error);
        process.exit(1);
    }
}

syncMachines();
