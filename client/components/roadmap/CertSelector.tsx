import { Certification } from "@/hooks/useRoadmap";

interface CertSelectorProps {
  certifications: Certification[];
  selectedCertId: number | null;
  onSelectCert: (certId: number) => void;
}

export function CertSelector({ certifications, selectedCertId, onSelectCert }: CertSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {certifications.map(cert => {
        const machineCount = cert.weeks.reduce((acc, w) => acc + w.machines.length, 0);
        const isSelected = cert.id === selectedCertId;
        return (
          <button
            key={cert.id}
            onClick={() => onSelectCert(cert.id)}
            className={`px-4 py-2 rounded-sm border text-sm font-mono font-bold transition-all ${
              isSelected 
                ? "bg-green-500 text-black border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                : "bg-black/40 border-white/10 text-foreground/50 hover:border-primary/50 hover:text-primary"
            }`}
          >
            {cert.name} <span className="opacity-60 text-xs">({machineCount})</span>
          </button>
        );
      })}
    </div>
  );
}
