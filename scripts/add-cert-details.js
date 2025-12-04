import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CERT_DETAILS = {
  "eJPT": {
    summary: "La eJPT (eLearnSecurity Junior Penetration Tester) es una certificación práctica de nivel inicial que valida las habilidades fundamentales de pentesting. A diferencia de exámenes teóricos, aquí te enfrentas a un entorno real donde debes realizar un pentesting completo.",
    tips: [
      "No te atasques en un solo vector, enumera todo.",
      "Toma notas detalladas de cada hallazgo.",
      "Revisa bien el enrutamiento y pivoting básico.",
      "Usa Metasploit, está permitido y es útil aquí."
    ]
  },
  "eCPPTv3": {
    summary: "eCPPTv3 (Certified Professional Penetration Tester) es una certificación avanzada que simula un compromiso corporativo real. Requiere pivoting profundo, desarrollo de exploits básicos y un reporte profesional exhaustivo.",
    tips: [
      "El pivoting es la clave del examen.",
      "Domina el buffer overflow básico (stack based).",
      "El reporte es el 50% de la nota, hazlo profesional.",
      "Enumera bien los servicios internos tras el pivot."
    ]
  },
  "OSCP": {
    summary: "OSCP (Offensive Security Certified Professional) es el estándar de oro en pentesting. Un examen de 24 horas donde debes comprometer múltiples máquinas y un Directorio Activo, demostrando resistencia y metodología 'Try Harder'.",
    tips: [
      "Gestiona bien tu tiempo, no te obsesiones con una máquina.",
      "El Directorio Activo es obligatorio, practícalo mucho.",
      "Toma capturas de pantalla de cada flag y paso.",
      "Descansa y duerme un poco durante el examen."
    ]
  },
  "OSEP": {
    summary: "OSEP (Offensive Security Experienced Penetration Tester) se enfoca en la evasión de defensas y pentesting avanzado. Aprenderás a crear malware indetectable, bypass de AppLocker y movimientos laterales complejos.",
    tips: [
      "La evasión de antivirus es fundamental.",
      "Practica mucho la creación de payloads custom.",
      "Entiende bien cómo funciona MSSQL para movimientos laterales.",
      "La enumeración de AD sigue siendo vital."
    ]
  },
  "OSWE": {
    summary: "OSWE (Offensive Security Web Expert) es una certificación avanzada de seguridad web (White Box). Te dan el código fuente y debes encontrar vulnerabilidades complejas y encadenarlas para obtener RCE.",
    tips: [
      "Aprende a leer código rápido (PHP, Java, Python, .NET).",
      "Sigue el flujo de los datos (User Input -> Sink).",
      "Practica la creación de scripts en Python para automatizar exploits.",
      "No busques solo inyecciones SQL, mira la lógica."
    ]
  },
  "eWPT": {
    summary: "eWPT certifica tus habilidades en pentesting web a nivel profesional. Cubre todas las vulnerabilidades del OWASP Top 10 y requiere un reporte detallado de los hallazgos.",
    tips: [
      "Domina Burp Suite y sus extensiones.",
      "Entiende bien XSS y SQLi manual.",
      "El reporte debe explicar el impacto de negocio.",
      "Verifica cada vulnerabilidad manualmente."
    ]
  },
  "eWPTXv2": {
    summary: "eWPTXv2 es la versión extrema de la certificación web. Se centra en ataques avanzados, evasión de filtros (WAF), y explotación de vulnerabilidades complejas en entornos modernos.",
    tips: [
      "Aprende técnicas avanzadas de evasión de filtros.",
      "Practica la serialización insegura en varios lenguajes.",
      "Domina los ataques de lado del cliente (XSS avanzado, CSRF).",
      "La ofuscación de payloads es clave."
    ]
  },
  "eCPTXv2": {
    summary: "eCPTXv2 es una de las certificaciones más difíciles, enfocada en Red Teaming y escenarios corporativos complejos de alta seguridad. Requiere compromiso total de dominios y evasión avanzada.",
    tips: [
      "Domina Kerberos y ataques avanzados de AD.",
      "El pivoting a través de múltiples redes es constante.",
      "Aprende a persistir de forma sigilosa.",
      "Piensa como un adversario real, no solo un pentester."
    ]
  },
  "OSED": {
    summary: "OSED (Offensive Security Exploit Developer) se centra en el desarrollo de exploits binarios en Windows. Bypass de DEP, ASLR, y creación de shellcode personalizado.",
    tips: [
      "Domina el debugger (WinDbg, x64dbg).",
      "Entiende a fondo la arquitectura x86/x64.",
      "Practica el ROP (Return Oriented Programming) hasta soñar con gadgets.",
      "La paciencia y la atención al detalle son tus mejores armas."
    ]
  }
};

async function addCertDetails() {
  try {
    const sourcePath = path.join(__dirname, "../todas_las_certificaciones_db.json");
    const rawData = fs.readFileSync(sourcePath, "utf8");
    const sourceData = JSON.parse(rawData);

    let updatedCount = 0;

    // The JSON is an array of weeks. We need to update the CERTIFICATION info.
    // Since the JSON structure is flat (weeks), we don't have a "certifications" array inside.
    // But we can add these fields to the objects, and the seed script will pick them up 
    // when it upserts the certification.
    
    // Actually, it's better to add these fields to every week object? No, that's redundant.
    // The seed script iterates weeks and upserts the cert. 
    // So if we add `cert_summary` and `cert_tips` to the week objects, the seed script can read them.
    
    for (const item of sourceData) {
      const certName = item.certification_name || item.certification;
      const details = CERT_DETAILS[certName];

      if (details) {
        item.cert_summary = details.summary;
        item.cert_tips = details.tips;
        updatedCount++;
      }
    }

    fs.writeFileSync(sourcePath, JSON.stringify(sourceData, null, 2));
    console.log(`✅ Updated ${updatedCount} week entries with cert details.`);

  } catch (error) {
    console.error("❌ Error updating cert details:", error);
  }
}

addCertDetails();
