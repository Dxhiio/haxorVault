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

// Embedded mapping (Spanish -> English)
const SPANISH_TO_ENGLISH = {
  "Reconocimiento pasivo": "Reconnaissance",
  "OSINT básico": "OSINT",
  "Footprinting": "Reconnaissance",
  "Escaneo de redes": "Reconnaissance",
  "Enumeración de servicios": "Enumeration",
  "Banner grabbing": "Reconnaissance",
  "Explotación básica web": "Web",
  "SQL injection manual": "SQL Injection",
  "XSS básico": "XSS",
  "Metasploit Framework": "Metasploit",
  "Uso de exploits públicos": "Public Exploits",
  "Meterpreter básico": "Metasploit",
  "Post-exploitation básico": "Post-Exploitation",
  "Escalada de privilegios Linux": "Privilege Escalation",
  "Hash cracking": "Password Cracking",
  "Network pivoting": "Pivoting",
  "VLAN hopping": "VLAN Hopping",
  "ARP spoofing": "MitM",
  "Web attacks avanzados": "Web",
  "File inclusion": "LFI",
  "Password attacks": "Password Cracking",
  "Brute forcing": "Brute Force",
  "Dictionary attacks": "Password Cracking",
  "Metodología de pentesting profesional": "Methodology",
  "Scoping y planning": "Planning",
  "Report writing": "Reporting",
  "Network reconnaissance avanzado": "Reconnaissance",
  "Network mapping": "Reconnaissance",
  "Service fingerprinting": "Enumeration",
  "Advanced network attacks": "Network",
  "VLAN segmentation bypass": "VLAN Hopping",
  "Network device exploitation": "Network",
  "Active Directory pentesting": "Active Directory",
  "AD enumeration": "Enumeration",
  "Credential harvesting": "Credential Harvesting",
  "Wireless pentesting": "Wireless",
  "WPA2 enterprise attacks": "Wireless",
  "Evil twin attacks": "Wireless",
  "VoIP security testing": "VoIP",
  "SIP attacks": "VoIP",
  "Asterisk exploitation": "VoIP",
  "IoT device testing": "IoT",
  "Embedded systems": "IoT",
  "Firmware analysis": "IoT",
  "Advanced pivoting scenarios": "Pivoting",
  "Multi-network traversal": "Pivoting",
  "Complex network topologies": "Network",
  "Red team scenarios": "Red Team",
  "Full engagement simulation": "Red Team",
  "Detection evasion": "Evasion",
  "Advanced reporting": "Reporting",
  "Executive summaries": "Reporting",
  "Remediation guidance": "Reporting",
  "Enumeración básica con Nmap": "Reconnaissance",
  "Exploits públicos conocidos": "Public Exploits",
  "Windows privilege escalation": "Privilege Escalation",
  "Servicios vulnerables": "Vulnerable Services",
  "File upload attacks": "File Upload",
  "Linux privilege escalation": "Privilege Escalation",
  "Web fuzzing básico": "Fuzzing",
  "Kernel exploits": "Kernel Exploitation",
  "Active Directory básico": "Active Directory",
  "Buffer overflow básico": "Buffer Overflow",
  "Local File Inclusion": "LFI",
  "Active Directory intermedio": "Active Directory",
  "BloodHound analysis": "BloodHound",
  "Credential dumping": "Credential Dumping",
  "Web exploitation avanzado": "Web",
  "XXE attacks": "XXE",
  "SSRF": "SSRF",
  "Pivoting y port forwarding": "Pivoting",
  "Chisel/SSH tunneling": "Tunneling",
  "Multi-hop attacks": "Pivoting",
  "Format string vulnerabilities": "Format String",
  "Evasión de AV": "AV Evasion",
  "Code obfuscation": "Obfuscation",
  "Custom payloads": "Custom Payloads",
  "Active Directory avanzado": "Active Directory",
  "Trust relationships": "Active Directory",
  "Delegation attacks": "Active Directory",
  "Bypass protections": "Evasion",
  "Custom shellcode": "Shellcode",
  "Advanced pivoting": "Pivoting",
  "Múltiples vectores combinados": "Chain",
  "Red teaming techniques": "Red Team",
  "Zero-day research": "Zero Day",
  "Vulnerability discovery": "Vulnerability Research",
  "CVE hunting": "CVE",
  "Bypass DEP": "Exploit Development",
  "ROP gadget hunting": "ROP",
  "ASLR bypass": "Exploit Development",
  "Information leak": "Info Leak",
  "Partial overwrite": "Exploit Development",
  "Advanced enumeration": "Enumeration",
  "PowerShell for reconnaissance": "PowerShell",
  "WMI queries": "WMI",
  "Process injection": "Process Injection",
  "DLL injection": "DLL Injection",
  "Reflective DLL injection": "DLL Injection",
  "Advanced AD attacks": "Active Directory",
  "Constrained delegation": "Active Directory",
  "Resource-based delegation": "Active Directory",
  "Evasión avanzada": "Evasion",
  "EDR bypass": "Evasion",
  "Custom loaders": "Malware Dev",
  "Advanced C2 development": "C2",
  "Custom implants": "Malware Dev",
  "Malleable C2 profiles": "C2",
  "Kernel-mode attacks": "Kernel Exploitation",
  "Driver exploitation": "Driver Exploitation",
  "BYOVD": "Driver Exploitation",
  "Advanced persistence": "Persistence",
  "Bootkit/Rootkit basics": "Rootkit",
  "Hardware attacks": "Hardware",
  "Red team operations": "Red Team",
  "Full kill chain": "Kill Chain",
  "APT simulation": "APT",
  "Fundamentos de desarrollo web": "Web",
  "HTTP protocol deep dive": "Web",
  "Session management": "Session Management",
  "Client-side attacks": "Client Side",
  "XSS variants": "XSS",
  "CSRF": "CSRF",
  "Injection básica": "Injection",
  "SQL injection avanzado": "SQL Injection",
  "NoSQL injection": "NoSQL Injection",
  "LFI/RFI": "LFI",
  "Path traversal": "Directory Traversal",
  "XML attacks": "XML",
  "XXE": "XXE",
  "XPath injection": "Injection",
  "Template injection": "SSTI",
  "SSTI": "SSTI",
  "Client-side template injection": "CSTI",
  "Deserialization attacks": "Deserialization",
  "Java/PHP/Python deserialization": "Deserialization",
  "Object injection": "Deserialization",
  "OAuth/SAML attacks": "OAuth",
  "Token manipulation": "Tokens",
  "GraphQL attacks": "GraphQL",
  "API security": "API",
  "REST API exploitation": "API",
  "WebSocket attacks": "WebSockets",
  "CORS misconfiguration": "CORS",
  "Prototype pollution": "Prototype Pollution",
  "Advanced deserialization": "Deserialization",
  "Custom gadget chains": "Deserialization",
  "POP chains": "Deserialization",
  "Type juggling": "Type Juggling",
  "Race conditions": "Race Condition",
  "Time-of-check attacks": "Race Condition",
  "Advanced template injection": "SSTI",
  "Filter bypass": "Bypass",
  "Custom framework exploitation": "Web",
  "Source code review": "Code Review",
  "Logic flaws": "Logic",
  "Metodología de pentesting web": "Methodology",
  "OWASP Top 10": "OWASP",
  "Burp Suite basics": "Burp Suite",
  "Inyección SQL avanzada": "SQL Injection",
  "Blind SQLi": "SQL Injection",
  "Time-based attacks": "SQL Injection",
  "XSS avanzado": "XSS",
  "DOM XSS": "XSS",
  "XSS filter bypass": "XSS",
  "Authentication attacks": "Auth",
  "Session fixation": "Session Management",
  "Broken auth": "Auth",
  "IDOR y mass assignment": "IDOR",
  "Parameter tampering": "Web",
  "Price manipulation": "Logic",
  "SSTI y template engines": "SSTI",
  "Jinja2/Twig exploitation": "SSTI",
  "Template sandbox escape": "SSTI",
  "Deserialization web": "Deserialization",
  "PHP object injection": "Deserialization",
  "Java deserialization": "Deserialization",
  "SSRF attacks": "SSRF",
  "Internal network access": "Network",
  "Cloud metadata abuse": "Cloud",
  "WebSockets security": "WebSockets",
  "Real-time attack vectors": "WebSockets",
  "Socket.io exploitation": "WebSockets",
  "JWT attacks": "JWT",
  "Token forgery": "JWT",
  "Algorithm confusion": "JWT",
  "Advanced XXE": "XXE",
  "Out-of-band XXE": "XXE",
  "XXE filter bypass": "XXE",
  "Business logic flaws": "Logic",
  "Race conditions web": "Race Condition",
  "Payment bypass": "Logic",
  "GraphQL advanced": "GraphQL",
  "Introspection abuse": "GraphQL",
  "Batching attacks": "GraphQL",
  "HTTP smuggling": "HTTP Smuggling",
  "Request splitting": "HTTP Smuggling",
  "Advanced web reconnaissance": "Reconnaissance",
  "Technology fingerprinting": "Reconnaissance",
  "Hidden endpoint discovery": "Reconnaissance",
  "Advanced injection": "Injection",
  "Second-order SQLi": "SQL Injection",
  "Polyglot payloads": "Payloads",
  "Client-side exploitation": "Client Side",
  "Clickjacking": "Clickjacking",
  "Postmessage XSS": "XSS",
  "JavaScript exploitation": "JavaScript",
  "Client-side prototype pollution": "Prototype Pollution",
  "Gadget chain construction": "Deserialization",
  "Custom POP chains": "Deserialization",
  "API security advanced": "API",
  "Mass assignment": "API",
  "GraphQL nested queries": "GraphQL",
  "OAuth 2.0 exploitation": "OAuth",
  "Implicit flow attacks": "OAuth",
  "Authorization code interception": "OAuth",
  "Server-side prototype pollution": "Prototype Pollution",
  "Node.js exploitation": "Node.js",
  "Framework-specific attacks": "Web",
  "Advanced SSRF": "SSRF",
  "Cloud metadata exploitation": "Cloud",
  "Internal service abuse": "SSRF",
  "HTTP/2 attacks": "HTTP/2",
  "H2C smuggling": "HTTP Smuggling",
  "Stream multiplexing abuse": "HTTP/2",
  "Advanced authentication bypass": "Auth Bypass",
  "SAML attacks": "SAML",
  "Multi-factor bypass": "MFA Bypass",
  "Advanced delegation attacks": "Active Directory",
  "Constrained/unconstrained delegation": "Active Directory",
  "Advanced persistence AD": "Persistence",
  "DCShadow": "Active Directory",
  "DCSync abuse": "Active Directory",
  "Azure AD attacks": "Azure",
  "Hybrid identity exploitation": "Azure",
  "Cloud-AD pivoting": "Cloud"
};

async function enrichRoadmap() {
  try {
    console.log("🔍 Fetching reference data from Supabase...");

    // 1. Fetch Machines
    const { data: machines, error: machinesError } = await supabase
      .from("htb_machines")
      .select("id, name");
    if (machinesError) throw machinesError;

    const machineMap = new Map();
    machines.forEach((m) => machineMap.set(m.name.toLowerCase(), m.id));

    // 2. Fetch Techniques
    const { data: techniques, error: techError } = await supabase
      .from("techniques")
      .select("id, name");
    if (techError) throw techError;

    const techniqueMap = new Map();
    techniques.forEach((t) => techniqueMap.set(t.name.toLowerCase(), { id: t.id, name: t.name }));

    console.log(`✅ Loaded ${machines.length} machines and ${techniques.length} techniques.`);

    // 3. Read Source JSON
    const sourcePath = path.join(__dirname, "../todas_las_certificaciones_db.json");
    const rawData = fs.readFileSync(sourcePath, "utf8");
    const sourceData = JSON.parse(rawData);

    // 4. Enrich Data
    for (const item of sourceData) {
      // Enrich Machines
      if (item.machines_data) {
        for (const m of item.machines_data) {
          const mId = machineMap.get(m.name.trim().toLowerCase());
          if (mId) {
            m.id = mId;
            m.db_status = "linked";
          } else {
            m.id = null;
            m.db_status = "missing";
          }
        }
      }

      // Enrich Techniques
      if (item.techniques_data) {
        for (const t of item.techniques_data) {
          const tName = t.name.trim();
          let dbTech = techniqueMap.get(tName.toLowerCase());
          
          // Try mapping if not found
          if (!dbTech && SPANISH_TO_ENGLISH[tName]) {
            const mappedName = SPANISH_TO_ENGLISH[tName];
            dbTech = techniqueMap.get(mappedName.toLowerCase());
          }

          if (dbTech) {
            t.id = dbTech.id;
            t.db_technique = dbTech.name;
            t.db_status = "linked";
          } else {
            t.id = null;
            t.db_technique = null;
            t.db_status = "missing";
          }
        }
      }
    }

    // 5. Save Enriched Data
    // We overwrite the file as requested to "add id" to it
    fs.writeFileSync(sourcePath, JSON.stringify(sourceData, null, 2));

    console.log(`\n🎉 Enrichment complete! Updated todas_las_certificaciones_db.json`);
    
  } catch (error) {
    console.error("❌ Error enriching data:", error);
  }
}

enrichRoadmap();
