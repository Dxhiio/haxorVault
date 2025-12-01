import "dotenv/config";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// HTB API key
const API_KEY = process.env.HTB_API_KEY;

if (!API_KEY) {
  console.error("Error: HTB_API_KEY is not defined in environment variables");
  process.exit(1);
}

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Supabase configuration is missing");
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Rate limiting delay (in milliseconds)
const RATE_LIMIT_DELAY = 1000;

// Maximum retries for rate limited requests
const MAX_RETRIES = 3;

async function makeApiRequest(url, retries = 0) {
  try {
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 10000 // 10 second timeout
    });
    
    return response;
  } catch (error) {
    if (error.response?.status === 429 && retries < MAX_RETRIES) {
      console.warn(`Rate limited. Retrying in ${RATE_LIMIT_DELAY}ms... (attempt ${retries + 1})`);
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      return makeApiRequest(url, retries + 1);
    }
    
    if (error.response?.status === 429 && retries >= MAX_RETRIES) {
      throw new Error(`Rate limited after ${MAX_RETRIES} retries`);
    }
    
    throw error;
  }
}

async function getAllMachinesPaginated(baseUrl, perPage = 50) {
  let allMachines = [];
  let page = 1;
  let hasMore = true;
  
  console.log(`Fetching paginated machines from ${baseUrl} with per_page=${perPage}`);
  
  while (hasMore) {
    const url = `${baseUrl}?per_page=${perPage}&page=${page}`;
    console.log(`Fetching page ${page}...`);
    
    try {
      const response = await makeApiRequest(url);
      
      if (response.data && Array.isArray(response.data.data)) {
        const machines = response.data.data;
        
        // Add to our collection
        allMachines = allMachines.concat(machines);
        
        console.log(`Page ${page}: Retrieved ${machines.length} machines`);
        
        // Check if this page has fewer items than per_page, meaning it's the last page
        if (machines.length < perPage) {
          hasMore = false;
        }
      } else {
        console.warn(`Unexpected data structure on page ${page}`);
        hasMore = false;
      }
      
      page++;
      
      // Add delay to respect rate limiting
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message);
      if (error.response?.status === 404) {
        console.log("No more pages or endpoint not found");
        hasMore = false;
      } else {
        throw error;
      }
    }
  }
  
  console.log(`Total machines fetched: ${allMachines.length}`);
  return allMachines;
}

async function getMachineDetails(machineId) {
  try {
    const url = `https://labs.hackthebox.com/api/v4/machine/profile/${machineId}`;
    console.log(`Fetching details for machine ${machineId}...`);
    
    const response = await makeApiRequest(url);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching details for machine ${machineId}:`, error.message);
    return null;
  }
}

// Function to display sample data structure for validation
async function validateDataStructure() {
  try {
    console.log("🔍 Validating HTB API Data Structure...\n");
    
    // Get first few active machines to see the structure
    console.log("1. Fetching sample active/seasonal machines...");
    const activeMachines = await getAllMachinesPaginated(
      "https://labs.hackthebox.com/api/v4/machine/paginated", 
      5
    );
    
    if (activeMachines.length > 0) {
      console.log("\n📋 Sample Active/Seasonal Machine Structure:");
      console.log(JSON.stringify(activeMachines[0], null, 2));
    } else {
      console.log("No active machines found");
    }
    
    // Get first few retired machines to see the structure
    console.log("\n2. Fetching sample retired machines...");
    const retiredMachines = await getAllMachinesPaginated(
      "https://labs.hackthebox.com/api/v4/machine/retired", 
      5
    );
    
    if (retiredMachines.length > 0) {
      console.log("\n📋 Sample Retired Machine Structure:");
      console.log(JSON.stringify(retiredMachines[0], null, 2));
    } else {
      console.log("No retired machines found (this might be expected)");
    }
    
    // Get detailed information for one machine
    if (activeMachines.length > 0) {
      console.log("\n3. Fetching detailed information for sample machine...");
      const sampleMachine = activeMachines[0];
      const detailedInfo = await getMachineDetails(sampleMachine.id);
      
      if (detailedInfo) {
        console.log("\n📋 Detailed Machine Information:");
        console.log(JSON.stringify(detailedInfo, null, 2));
      }
    }
    
    console.log("\n✅ Data structure validation completed!");
    console.log("📝 Based on this data structure, we can now properly map fields for synchronization.");
    
  } catch (error) {
    console.error("❌ Error during data structure validation:", error);
    throw error;
  }
}

// Function to process and map machine data correctly
async function processMachineData(machineData, isRetired = false) {
  // Extract the relevant fields from the API response
  const processedMachine = {
    id: machineData.id,
    name: machineData.name || null,
    os: machineData.os || null,
    difficulty_text: machineData.difficultyText || null,
    points: machineData.points || null,
    status: isRetired ? "retired" : machineData.status || "active",
    ip_address: machineData.ip || null, // IP might be in the main data
    updated_at: new Date().toISOString(),
    metadata: {
      avatar: machineData.avatar || null,
      star: machineData.star || null,
      release: machineData.release || null,
      labels: machineData.labels || null,
      recommended: machineData.recommended || null,
      user_owns_count: machineData.user_owns_count || null,
      root_owns_count: machineData.root_owns_count || null,
      is_competitive: machineData.is_competitive || null,
      difficulty: machineData.difficulty || null,
      static_points: machineData.static_points || null,
      free: machineData.free || null,
      // Include any additional metadata from the detailed info
      ...machineData.metadata
    }
  };
  
  return processedMachine;
}

async function upsertMachine(machineData, isRetired = false) {
  try {
    // Process the machine data to map fields correctly
    const processedMachine = await processMachineData(machineData, isRetired);
    
    const { data, error } = await supabase
      .from("machines")
      .upsert([processedMachine], {
        onConflict: "id"
      });
    
    if (error) {
      console.error(`Error upserting machine ${machineData.name}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error upserting machine ${machineData.name}:`, error);
    return false;
  }
}

// Main sync function (keep this for actual synchronization)
async function syncHTBMachines() {
  const stats = {
    inserted: 0,
    updated: 0,
    errors: 0
  };
  
  try {
    console.log("Starting HTB machines synchronization with full API v4 integration...");
    
    // Fetch all active/seasonal machines from paginated endpoint
    console.log("\n1. Fetching all active/seasonal machines...");
    const activeMachines = await getAllMachinesPaginated(
      "https://labs.hackthebox.com/api/v4/machine/paginated", 
      50
    );
    
    console.log(`Found ${activeMachines.length} active/seasonal machines`);
    
    // Process each machine to get full details
    for (let i = 0; i < activeMachines.length; i++) {
      const machine = activeMachines[i];
      
      try {
        // Get detailed information including IP address
        const detailedMachine = await getMachineDetails(machine.id);
        
        if (detailedMachine) {
          // Merge the detailed data with the basic data
          const mergedMachine = {
            ...machine,
            ...detailedMachine,
            status: machine.status || "active"
          };
          
          const success = await upsertMachine(mergedMachine, false);
          if (success) {
            stats.updated++;
          } else {
            stats.errors++;
          }
        } else {
          // If we can't get detailed info, still upsert with basic data
          const success = await upsertMachine(machine, false);
          if (success) {
            stats.updated++;
          } else {
            stats.errors++;
          }
        }
      } catch (machineError) {
        console.error(`Error processing machine ${machine.name || machine.id}:`, machineError);
        stats.errors++;
      }
      
      // Add delay between requests to prevent rate limiting
      if (i < activeMachines.length - 1) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
    }
    
    // For retired machines, we'll use the same approach but with the retired status
    console.log("\n2. Fetching all retired machines...");
    const retiredMachines = await getAllMachinesPaginated(
      "https://labs.hackthebox.com/api/v4/machine/retired", 
      50
    );
    
    console.log(`Found ${retiredMachines.length} retired machines`);
    
    // Process retired machines
    for (let i = 0; i < retiredMachines.length; i++) {
      const machine = retiredMachines[i];
      
      try {
        // Get detailed information including IP address
        const detailedMachine = await getMachineDetails(machine.id);
        
        if (detailedMachine) {
          // Merge the detailed data with the basic data
          const mergedMachine = {
            ...machine,
            ...detailedMachine,
            status: "retired"
          };
          
          const success = await upsertMachine(mergedMachine, true);
          if (success) {
            stats.inserted++;
          } else {
            stats.errors++;
          }
        } else {
          // If we can't get detailed info, still upsert with basic data
          const success = await upsertMachine(machine, true);
          if (success) {
            stats.inserted++;
          } else {
            stats.errors++;
          }
        }
      } catch (machineError) {
        console.error(`Error processing retired machine ${machine.name || machine.id}:`, machineError);
        stats.errors++;
      }
      
      // Add delay between requests to prevent rate limiting
      if (i < retiredMachines.length - 1) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
    }
    
    console.log("\n✅ Synchronization completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   • Inserted/Updated: ${stats.inserted + stats.updated}`);
    console.log(`   • Successfully processed: ${stats.inserted + stats.updated}`);
    console.log(`   • Errors: ${stats.errors}`);
    
    if (stats.errors > 0) {
      console.warn(`⚠️  There were ${stats.errors} errors during synchronization`);
    }
    
  } catch (error) {
    console.error("❌ Error during HTB synchronization:", error);
    throw error;
  }
}

// Function to handle data validation
async function validateData() {
  await validateDataStructure();
}

// Export both functions
export { syncHTBMachines, validateData };

// Run validation by default when script is executed
validateData();
