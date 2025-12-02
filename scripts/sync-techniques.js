import "dotenv/config";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// Configuration
const API_KEY = process.env.HTB_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

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
const RATE_LIMIT_DELAY = 500;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function makeApiRequest(url, retries = 0) {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429 && retries < 3) {
      const delay = RATE_LIMIT_DELAY * Math.pow(2, retries + 1);
      console.warn(`Rate limited. Retrying in ${delay}ms...`);
      await sleep(delay);
      return makeApiRequest(url, retries + 1);
    }
    throw error;
  }
}

async function syncTechniques() {
  try {
    console.log("🔍 Fetching all machines from database...");

    // Get all machines from DB
    const { data: machines, error: machinesError } = await supabase
      .from("htb_machines")
      .select("id, name")
      .order("id");

    if (machinesError) {
      throw machinesError;
    }

    console.log(`📦 Found ${machines.length} machines in database`);

    const allTechniques = new Map(); // id -> { id, name, category }
    const machineTechniquesMap = new Map(); // machine_id -> Set<technique_id>

    let processedCount = 0;

    for (const machine of machines) {
      try {
        console.log(
          `\n[${processedCount + 1}/${machines.length}] Processing: ${machine.name} (ID: ${machine.id})`,
        );

        await sleep(RATE_LIMIT_DELAY);

        // Fetch tags for this machine
        const tagsData = await makeApiRequest(
          `${BASE_URL}/machine/tags/${machine.id}`,
        );

        if (tagsData && tagsData.info && Array.isArray(tagsData.info)) {
          // Filter only "Technique" category
          const techniques = tagsData.info.filter(
            (tag) => tag.category === "Technique",
          );

          console.log(`  ✓ Found ${techniques.length} techniques`);

          if (techniques.length > 0) {
            // Add techniques to master list
            techniques.forEach((tech) => {
              if (!allTechniques.has(tech.id)) {
                allTechniques.set(tech.id, {
                  id: tech.id,
                  name: tech.name,
                  category: tech.category,
                });
              }
            });

            // Map machine to techniques
            if (!machineTechniquesMap.has(machine.id)) {
              machineTechniquesMap.set(machine.id, new Set());
            }
            techniques.forEach((tech) => {
              machineTechniquesMap.get(machine.id).add(tech.id);
            });

            console.log(
              `  → Techniques: ${techniques.map((t) => t.name).join(", ")}`,
            );
          }
        }

        processedCount++;
      } catch (error) {
        console.error(
          `  ✗ Error processing machine ${machine.id}:`,
          error.message,
        );
      }
    }

    console.log(`\n\n📊 Summary:`);
    console.log(`  • Machines processed: ${processedCount}/${machines.length}`);
    console.log(`  • Unique techniques found: ${allTechniques.size}`);
    console.log(
      `  • Machine-technique relationships: ${Array.from(machineTechniquesMap.values()).reduce((sum, set) => sum + set.size, 0)}`,
    );

    // Insert techniques into DB
    console.log(`\n💾 Inserting techniques into database...`);
    const techniquesArray = Array.from(allTechniques.values());

    if (techniquesArray.length > 0) {
      const { error: techError } = await supabase
        .from("techniques")
        .upsert(techniquesArray, { onConflict: "id", ignoreDuplicates: false });

      if (techError) {
        console.error("Error inserting techniques:", techError);
      } else {
        console.log(
          `  ✓ Inserted/updated ${techniquesArray.length} techniques`,
        );
      }
    }

    // Insert machine-technique relationships
    console.log(`\n🔗 Inserting machine-technique relationships...`);
    const relationships = [];

    for (const [machineId, techniqueIds] of machineTechniquesMap.entries()) {
      for (const techniqueId of techniqueIds) {
        relationships.push({
          machine_id: machineId,
          technique_id: techniqueId,
        });
      }
    }

    if (relationships.length > 0) {
      // Delete existing relationships first
      const { error: deleteError } = await supabase
        .from("machine_techniques")
        .delete()
        .neq("machine_id", 0); // Delete all

      if (deleteError) {
        console.error("Error deleting old relationships:", deleteError);
      }

      // Insert new relationships
      const { error: relError } = await supabase
        .from("machine_techniques")
        .insert(relationships);

      if (relError) {
        console.error("Error inserting relationships:", relError);
      } else {
        console.log(
          `  ✓ Inserted ${relationships.length} machine-technique relationships`,
        );
      }
    }

    console.log(`\n✅ Sync completed successfully!`);

    // Print technique list
    console.log(`\n📋 All Techniques:`);
    const sortedTechniques = Array.from(allTechniques.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    sortedTechniques.forEach((tech) => {
      console.log(`  • ${tech.name} (ID: ${tech.id})`);
    });
  } catch (error) {
    console.error("Fatal error during sync:", error);
    process.exit(1);
  }
}

syncTechniques();
