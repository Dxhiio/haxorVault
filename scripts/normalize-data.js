import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Error: Supabase configuration is missing");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function normalizeData() {
  try {
    console.log("🔍 Fetching reference data from Supabase...");

    // 1. Fetch Machines
    const { data: machines, error: machinesError } = await supabase
      .from("htb_machines")
      .select("id, name");
    if (machinesError) throw machinesError;

    // Create Machine Map (Name -> ID) - Case insensitive
    const machineMap = new Map();
    machines.forEach((m) => machineMap.set(m.name.toLowerCase(), m.id));

    // 2. Fetch Techniques
    const { data: techniques, error: techError } = await supabase
      .from("techniques")
      .select("id, name");
    if (techError) throw techError;

    // Create Technique Map (Name -> ID) - Case insensitive
    const techniqueMap = new Map();
    techniques.forEach((t) => techniqueMap.set(t.name.toLowerCase(), t.id));

    console.log(`✅ Loaded ${machines.length} machines and ${techniques.length} techniques.`);

    // 3. Read Source JSON
    const sourcePath = path.join(__dirname, "../todas_las_certificaciones_db.json");
    const rawData = fs.readFileSync(sourcePath, "utf8");
    const sourceData = JSON.parse(rawData);

    const normalizedData = [];
    const missingMachines = new Set();
    const missingTechniques = new Set();

    // 4. Process Data
    for (const item of sourceData) {
      const normalizedItem = {
        certification: item.certification_name,
        week: item.week_number,
        title: item.title,
        description: item.description,
        machines: [],
        techniques: [],
      };

      // Process Machines
      if (item.machines_data) {
        for (const m of item.machines_data) {
          const mName = m.name.trim();
          const mId = machineMap.get(mName.toLowerCase());
          if (mId) {
            normalizedItem.machines.push({ id: mId, name: mName });
          } else {
            normalizedItem.machines.push({ id: null, name: mName, error: "Not Found" });
            missingMachines.add(mName);
          }
        }
      }

      // Process Techniques
      if (item.techniques_data) {
        for (const t of item.techniques_data) {
          const tName = t.name.trim();
          // Try direct match first
          let tId = techniqueMap.get(tName.toLowerCase());
          
          // TODO: Add manual mapping logic here if needed
          
          if (tId) {
            normalizedItem.techniques.push({ id: tId, name: tName });
          } else {
            normalizedItem.techniques.push({ id: null, name: tName, error: "Not Found" });
            missingTechniques.add(tName);
          }
        }
      }

      normalizedData.push(normalizedItem);
    }

    // 5. Save Normalized Data
    const outputPath = path.join(__dirname, "../normalized_roadmap.json");
    fs.writeFileSync(outputPath, JSON.stringify(normalizedData, null, 2));

    console.log(`\n🎉 Normalization complete! Saved to normalized_roadmap.json`);
    
    if (missingMachines.size > 0) {
      console.log(`\n⚠️  Missing Machines (${missingMachines.size}):`);
      console.log(Array.from(missingMachines).join(", "));
    }

    if (missingTechniques.size > 0) {
      console.log(`\n⚠️  Missing Techniques (Need Mapping) (${missingTechniques.size}):`);
      // Show first 20 to avoid spam
      console.log(Array.from(missingTechniques).slice(0, 20).join(", ") + (missingTechniques.size > 20 ? "..." : ""));
      
      // Save missing techniques to a file for easier mapping
      const missingTechPath = path.join(__dirname, "../missing_techniques.json");
      fs.writeFileSync(missingTechPath, JSON.stringify(Array.from(missingTechniques), null, 2));
      console.log(`\n📝 Saved list of missing techniques to missing_techniques.json`);
    }

  } catch (error) {
    console.error("❌ Error normalizing data:", error);
  }
}

normalizeData();
