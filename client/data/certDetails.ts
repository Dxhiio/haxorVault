export const CERT_DETAILS: Record<string, { summary: string; features: string[]; tips: string[] }> = {
  "eJPT": {
    summary: "La eJPT es una certificación práctica de nivel inicial que valida las habilidades fundamentales de pentesting.",
    features: [
      "Pentesting práctico en entorno real",
      "Metodología de evaluación completa",
      "Reconocimiento y enumeración profunda",
      "Explotación y post-explotación básica"
    ],
    tips: [
      "No te atasques en un solo vector, enumera todo.",
      "Toma notas detalladas de cada hallazgo.",
      "Revisa bien el enrutamiento y pivoting básico.",
      "Usa Metasploit, está permitido y es útil aquí."
    ]
  },
  "eCPPTv3": {
    summary: "Certificación avanzada que simula un compromiso corporativo real.",
    features: [
      "61 máquinas de pentesting profesional completo",
      "VoIP security, IoT hacking y firmware analysis",
      "Network pentesting, wireless y pivoting avanzado",
      "Reporting profesional y metodología empresarial"
    ],
    tips: [
      "El pivoting es la clave del examen.",
      "Domina el buffer overflow básico (stack based).",
      "El reporte es el 50% de la nota, hazlo profesional.",
      "Enumera bien los servicios internos tras el pivot."
    ]
  },
  "OSCP": {
    summary: "El estándar de oro en pentesting. Un examen de 24 horas de resistencia.",
    features: [
      "Examen práctico de 24 horas",
      "Compromiso de Directorio Activo",
      "Explotación de Buffer Overflow",
      "Enumeración y escalada de privilegios manual"
    ],
    tips: [
      "Gestiona bien tu tiempo, no te obsesiones con una máquina.",
      "El Directorio Activo es obligatorio, practícalo mucho.",
      "Toma capturas de pantalla de cada flag y paso.",
      "Descansa y duerme un poco durante el examen."
    ]
  },
  "OSEP": {
    summary: "Evasión de defensas y pentesting avanzado.",
    features: [
      "Evasión de antivirus y protecciones",
      "Creación de malware indetectable",
      "Movimientos laterales en AD complejos",
      "Bypass de AppLocker y CLM"
    ],
    tips: [
      "La evasión de antivirus es fundamental.",
      "Practica mucho la creación de payloads custom.",
      "Entiende bien cómo funciona MSSQL para movimientos laterales.",
      "La enumeración de AD sigue siendo vital."
    ]
  },
  "OSWE": {
    summary: "Certificación avanzada de seguridad web (White Box).",
    features: [
      "Auditoría de código fuente (White Box)",
      "Explotación de vulnerabilidades lógicas",
      "Automatización de exploits en Python",
      "Encadenamiento de fallos para RCE"
    ],
    tips: [
      "Aprende a leer código rápido (PHP, Java, Python, .NET).",
      "Sigue el flujo de los datos (User Input -> Sink).",
      "Practica la creación de scripts en Python para automatizar exploits.",
      "No busques solo inyecciones SQL, mira la lógica."
    ]
  },
  "eWPT": {
    summary: "Certificación de pentesting web a nivel profesional.",
    features: [
      "Cobertura completa del OWASP Top 10",
      "Pentesting web manual y automatizado",
      "Reporte profesional de hallazgos",
      "XSS, SQLi y vulnerabilidades lógicas"
    ],
    tips: [
      "Domina Burp Suite y sus extensiones.",
      "Entiende bien XSS y SQLi manual.",
      "El reporte debe explicar el impacto de negocio.",
      "Verifica cada vulnerabilidad manualmente."
    ]
  },
  "eWPTXv2": {
    summary: "Versión extrema de la certificación web.",
    features: [
      "Evasión de WAF y filtros avanzados",
      "Ataques de serialización insegura",
      "Explotación avanzada del lado del cliente",
      "Vulnerabilidades en tecnologías modernas"
    ],
    tips: [
      "Aprende técnicas avanzadas de evasión de filtros.",
      "Practica la serialización insegura en varios lenguajes.",
      "Domina los ataques de lado del cliente (XSS avanzado, CSRF).",
      "La ofuscación de payloads es clave."
    ]
  },
  "eCPTXv2": {
    summary: "Red Teaming y escenarios corporativos complejos.",
    features: [
      "Simulación de Red Team completa",
      "Ataques avanzados de Kerberos y AD",
      "Pivoting multi-nivel y persistencia",
      "Evasión y exfiltración de datos"
    ],
    tips: [
      "Domina Kerberos y ataques avanzados de AD.",
      "El pivoting a través de múltiples redes es constante.",
      "Aprende a persistir de forma sigilosa.",
      "Piensa como un adversario real, no solo un pentester."
    ]
  },
  "OSED": {
    summary: "Desarrollo de exploits binarios en Windows.",
    features: [
      "Ingeniería inversa y depuración",
      "Desarrollo de exploits de corrupción de memoria",
      "Bypass de DEP y ASLR",
      "Creación de shellcode personalizado"
    ],
    tips: [
      "Domina el debugger (WinDbg, x64dbg).",
      "Entiende a fondo la arquitectura x86/x64.",
      "Practica el ROP (Return Oriented Programming) hasta soñar con gadgets.",
      "La paciencia y la atención al detalle son tus mejores armas."
    ]
  }
};
