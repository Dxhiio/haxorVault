import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useRoadmap } from "@/hooks/useRoadmap";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import LoginModal from "@/components/LoginModal";
import MachineDetailsModal from "@/components/MachineDetailsModal";
import { Machine } from "@/hooks/useMachines";
import { CERT_DETAILS } from "@/data/certDetails";
import { CertSelector } from "@/components/roadmap/CertSelector";
import { WeekCard } from "@/components/roadmap/WeekCard";

export default function Roadmap() {
  const { certifications, loading, error } = useRoadmap();
  const [selectedCertId, setSelectedCertId] = useState<number | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([]);
  const { isCompleted } = useUserProgress();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState<'about' | 'tips' | null>(null);

  useEffect(() => {
    if (certifications.length > 0 && !selectedCertId) {
      // Default to eWPT if found, otherwise first one
      const ewpt = certifications.find(c => c.name === 'eWPT');
      setSelectedCertId(ewpt ? ewpt.id : certifications[0].id);
    }
  }, [certifications, selectedCertId]);

  const selectedCert = certifications.find(c => c.id === selectedCertId);
  
  // Use DB data if available, otherwise fallback to local data
  const certSummary = selectedCert?.summary || (selectedCert ? CERT_DETAILS[selectedCert.name]?.summary : null);
  const certFeatures = selectedCert ? CERT_DETAILS[selectedCert.name]?.features : null;
  const certTips = selectedCert?.tips || (selectedCert ? CERT_DETAILS[selectedCert.name]?.tips : null);

  const toggleInfo = (type: 'about' | 'tips') => {
    setExpandedInfo(prev => prev === type ? null : type);
  };

  const toggleWeek = (weekId: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekId) ? prev.filter(id => id !== weekId) : [...prev, weekId]
    );
  };

  const handleMachineClick = (machine: Machine) => {
    setSelectedMachine(machine);
    setDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-32 flex justify-center text-primary font-mono animate-pulse">
          Cargando roadmap...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="pt-32 flex justify-center text-red-500 font-mono">
          Error cargando roadmap: {error.message}
        </div>
      </Layout>
    );
  }

  // Calculate progress
  const totalMachines = selectedCert?.weeks.reduce((acc, week) => acc + week.machines.length, 0) || 0;
  const completedMachines = selectedCert?.weeks.reduce((acc, week) => 
    acc + week.machines.filter(m => isCompleted(m.id)).length, 0
  ) || 0;
  const progressPercent = totalMachines > 0 ? (completedMachines / totalMachines) * 100 : 0;

  return (
    <Layout onLoginClick={() => setLoginModalOpen(true)}>
      <div className="pt-24 pb-12 min-h-screen bg-background">
        <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold tracking-tighter uppercase glow-text">
                &gt; ROADMAP {selectedCert?.name}
              </h1>
              <Button variant="outline" className="neon-border font-mono text-xs" onClick={() => window.history.back()}>
                [VOLVER]
              </Button>
            </div>
            
            <div className="text-sm font-mono text-foreground/70 uppercase tracking-widest">
              $ Preparación Estructurada para Certificación
            </div>

            {/* Cert Selection Tabs */}
            <CertSelector 
              certifications={certifications}
              selectedCertId={selectedCertId}
              onSelectCert={(id) => {
                setSelectedCertId(id);
                setExpandedInfo(null);
              }}
            />

            {/* Progress Bar */}
            <div className="space-y-2 glow-box p-6 border-primary/20 rounded-sm">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-foreground/70">Progreso Total</span>
                <span className="text-primary font-bold">{completedMachines}/{totalMachines} máquinas ({Math.round(progressPercent)}%)</span>
              </div>
              <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-green-400 transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                 <div className="text-[10px] text-yellow-500/70 flex items-center gap-1">
                   <span className="animate-pulse">💡</span> Tip: Usa el botón "Actualizar Progreso" después de completar máquinas
                 </div>
                 <Button size="sm" className="button-glow bg-primary text-black font-bold text-xs">
                   Actualizar Progreso
                 </Button>
              </div>
            </div>
            
            {/* Collapsible Info Sections */}
            <div className="space-y-4">
               {/* Buttons Row */}
               <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => toggleInfo('about')}
                   className={`p-3 rounded-sm text-center font-mono text-sm font-bold transition-all border ${
                     expandedInfo === 'about' 
                       ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                       : 'bg-blue-500/5 border-blue-500/30 text-blue-400/70 hover:bg-blue-500/10 hover:text-blue-400'
                   }`}
                 >
                   <span className="flex items-center justify-center gap-2">
                     📄 Sobre {selectedCert?.name}
                   </span>
                 </button>
                 <button 
                   onClick={() => toggleInfo('tips')}
                   className={`p-3 rounded-sm text-center font-mono text-sm font-bold transition-all border ${
                     expandedInfo === 'tips' 
                       ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                       : 'bg-purple-500/5 border-purple-500/30 text-purple-400/70 hover:bg-purple-500/10 hover:text-purple-400'
                   }`}
                 >
                   <span className="flex items-center justify-center gap-2">
                     💡 Consejos
                   </span>
                 </button>
               </div>

               {/* Content Areas */}
               {expandedInfo === 'about' && (
                 <div className="border border-blue-500 rounded-sm bg-blue-950/20 p-6 animate-in fade-in slide-in-from-top-2">
                   <div className="grid md:grid-cols-2 gap-4">
                     {certFeatures && certFeatures.length > 0 ? (
                       certFeatures.map((feature, idx) => (
                         <div key={idx} className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                           <span className="text-sm font-mono text-foreground/90">{feature}</span>
                         </div>
                       ))
                     ) : (
                       <div className="col-span-2 text-sm font-mono text-foreground/70">
                         {certSummary || "Información no disponible."}
                       </div>
                     )}
                   </div>
                 </div>
               )}

               {expandedInfo === 'tips' && (
                 <div className="border border-purple-500 rounded-sm bg-purple-950/20 p-6 animate-in fade-in slide-in-from-top-2">
                   <ul className="space-y-3">
                      {certTips && certTips.length > 0 ? (
                        certTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-yellow-500 mt-0.5">➜</span>
                            <span className="text-sm font-mono text-foreground/90">{tip}</span>
                          </li>
                        ))
                      ) : (
                        <li>No hay consejos disponibles.</li>
                      )}
                    </ul>
                 </div>
               )}
            </div>
          </div>

          {/* Weeks List */}
          <div className="space-y-4">
            {selectedCert?.weeks
              .sort((a, b) => a.week_number - b.week_number)
              .map((week, index, allWeeks) => {
              
              // Locking Logic
              const isWeekCompleted = (w: typeof week) => {
                if (w.machines.length === 0) return true; // Auto-complete empty weeks
                return w.machines.every(m => isCompleted(m.id));
              };

              let isLocked = false;
              if (index > 0) {
                const previousWeek = allWeeks[index - 1];
                isLocked = !isWeekCompleted(previousWeek);
              }

              return (
                <WeekCard
                  key={week.id}
                  week={week}
                  isExpanded={expandedWeeks.includes(week.id)}
                  isLocked={isLocked}
                  onToggle={() => toggleWeek(week.id)}
                  onMachineClick={handleMachineClick}
                  isCompleted={isCompleted}
                />
              );
            })}
          </div>

        </div>
      </div>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <MachineDetailsModal
        isOpen={detailsModalOpen}
        machine={selectedMachine}
        onClose={() => setDetailsModalOpen(false)}
      />
    </Layout>
  );
}
