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

async function seedEnrichedRoadmap() {
  try {
    console.log("🚀 Starting enriched roadmap seed...");

    // 1. Read Enriched JSON
    const sourcePath = path.join(__dirname, "../todas_las_certificaciones_db.json");
    const rawData = fs.readFileSync(sourcePath, "utf8");
    const sourceData = JSON.parse(rawData);

    console.log(`📦 Loaded ${sourceData.length} weeks of data.`);

    // 2. Clean existing data (Optional: be careful with this in prod)
    console.log("🧹 Cleaning existing roadmap data...");
    
    // Delete in order of dependencies
    const { error: e1 } = await supabase.from("roadmap_week_machines").delete().neq("week_id", 0); // Hack to delete all
    if (e1) console.warn("Warning deleting week_machines:", e1.message);
    
    const { error: e2 } = await supabase.from("roadmap_week_techniques").delete().neq("week_id", 0);
    if (e2) console.warn("Warning deleting week_techniques:", e2.message);

    const { error: e3 } = await supabase.from("roadmap_weeks").delete().neq("id", 0);
    if (e3) console.warn("Warning deleting weeks:", e3.message);
    
    // We don't delete certifications to avoid breaking other things if they exist, 
    // but we will upsert them.
    
    // 3. Process Data
    const certMap = new Map(); // Name -> ID

    for (const item of sourceData) {
      const certName = item.certification_name || item.certification; // Handle both keys if present
      
      // Ensure Cert Exists
      if (!certMap.has(certName)) {
        const { data: cert, error: certError } = await supabase
          .from("certifications")
          .upsert({ 
            name: certName,
            summary: item.cert_summary,
            tips: item.cert_tips
          }, { onConflict: "name" })
          .select()
          .single();
        
        if (certError) {
          console.error(`❌ Error creating cert ${certName}:`, certError.message);
          continue;
        }
        certMap.set(certName, cert.id);
        console.log(`  ✅ Certification: ${certName} (ID: ${cert.id})`);
      }

      const certId = certMap.get(certName);

      // Create Week
      const { data: week, error: weekError } = await supabase
        .from("roadmap_weeks")
        .insert({
          certification_id: certId,
          week_number: item.week_number || item.week,
          title: item.title,
          description: item.description
        })
        .select()
        .single();

      if (weekError) {
        console.error(`  ❌ Error creating week ${item.week_number} for ${certName}:`, weekError.message);
        continue;
      }

      // Link Machines
      if (item.machines_data) {
        const machineLinks = item.machines_data
          .filter(m => m.id) // Only link if ID exists
          .map(m => ({
            week_id: week.id,
            machine_id: m.id
          }));
        
        if (machineLinks.length > 0) {
          const { error: mError } = await supabase
            .from("roadmap_week_machines")
            .insert(machineLinks);
          
          if (mError) console.error(`    ❌ Error linking machines for week ${week.week_number}:`, mError.message);
        }
      }

      // Link Techniques
      if (item.techniques_data) {
        const techniqueLinks = item.techniques_data
          .filter(t => t.id) // Only link if ID exists
          .map(t => ({
            week_id: week.id,
            technique_id: t.id
          }));

        if (techniqueLinks.length > 0) {
          const { error: tError } = await supabase
            .from("roadmap_week_techniques")
            .insert(techniqueLinks);
          
          if (tError) console.error(`    ❌ Error linking techniques for week ${week.week_number}:`, tError.message);
        }
      }
      
      process.stdout.write("."); // Progress indicator
    }

    console.log("\n\n🎉 Seed complete!");

  } catch (error) {
    console.error("\n❌ Fatal error during seed:", error);
    process.exit(1);
  }
}

seedEnrichedRoadmap();
