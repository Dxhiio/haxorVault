import { RoadmapWeek } from "@/hooks/useRoadmap";
import { Machine } from "@/hooks/useMachines";
import { ChevronDown, ChevronUp, Terminal, Clock, Target, Lock, CheckCircle } from "lucide-react";
import { CyberBadge } from "@/components/ui/CyberBadge";

interface WeekCardProps {
  week: RoadmapWeek;
  isExpanded: boolean;
  isLocked: boolean;
  onToggle: () => void;
  onMachineClick: (machine: Machine) => void;
  isCompleted: (machineId: number) => boolean;
}

export function WeekCard({ 
  week, 
  isExpanded, 
  isLocked, 
  onToggle, 
  onMachineClick, 
  isCompleted 
}: WeekCardProps) {
  const weekMachineCount = week.machines.length;
  // Assuming ~3-4 hours per machine for estimation if not provided
  const estimatedHours = weekMachineCount * 4; 
  const techniqueCount = week.techniques.length;

  return (
    <div className={`border rounded-sm transition-all duration-300 ${
      isExpanded 
        ? 'border-green-500/50 bg-green-500/5' 
        : 'border-white/10 bg-card/20 hover:border-primary/30'
    }`}>
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="text-xs font-mono text-foreground/50 uppercase tracking-widest">
              SEMANA {week.week_number}
            </div>
            {isLocked && <Lock className="w-3 h-3 text-red-500" />}
          </div>
          
          <h3 className="text-xl font-bold text-foreground">
            {week.title || `Semana ${week.week_number}`}
          </h3>
          
          <p className="text-sm text-foreground/70 font-mono max-w-2xl">
            {week.description}
          </p>
          
          <div className="flex items-center gap-4 pt-2 text-xs font-mono text-foreground/60">
            <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-green-500" /> {weekMachineCount} máquinas</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-purple-500" /> ~{estimatedHours} horas</span>
            <span className="flex items-center gap-1"><Target className="w-3 h-3 text-red-500" /> {techniqueCount} técnicas clave</span>
          </div>
        </div>
        
        {isExpanded ? <ChevronUp className="w-6 h-6 text-primary" /> : <ChevronDown className="w-6 h-6 text-foreground/30" />}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
          
          {isLocked && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-sm p-3 flex items-center gap-3 text-red-400 text-sm font-mono mb-4">
              <Lock className="w-4 h-4" />
              <span>Contenido bloqueado. Completa la semana anterior para acceder a las máquinas.</span>
            </div>
          )}

          <div className={isLocked ? "opacity-50 pointer-events-none grayscale filter" : ""}>
            {/* Techniques */}
            {week.techniques.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">TÉCNICAS PRINCIPALES</h4>
                <div className="flex flex-wrap gap-2">
                  {week.techniques.map(tech => (
                    <CyberBadge key={tech.id} variant="outline" intent="primary" size="sm">
                      {tech.name}
                    </CyberBadge>
                  ))}
                </div>
              </div>
            )}

            {/* Machines */}
            <div className="space-y-3 mt-6">
              <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">MÁQUINAS ({weekMachineCount})</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {week.machines.map(machine => {
                  const completed = isCompleted(machine.id);
                  
                  // Normalize OS name
                  let osDisplay = machine.os;
                  if (machine.os.toLowerCase().includes('win')) osDisplay = 'Windows';
                  else if (machine.os.toLowerCase().includes('lin') || machine.os.toLowerCase().includes('lnx')) osDisplay = 'Linux';
                  else if (machine.os.toLowerCase().includes('mac')) osDisplay = 'macOS';
                  else if (machine.os.toLowerCase().includes('and')) osDisplay = 'Android';

                  return (
                    <button
                      key={machine.id}
                      onClick={() => onMachineClick(machine)}
                      className={`group relative p-4 rounded-sm border text-left transition-all ${
                        completed 
                          ? "bg-green-500/10 border-green-500/50" 
                          : "bg-black/40 border-white/10 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`text-sm font-bold ${completed ? "text-green-400" : "text-foreground group-hover:text-primary"}`}>
                          {machine.name}
                        </div>
                        {completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      
                      <div className="flex items-center justify-between text-[10px] font-mono text-foreground/50">
                        <span className={osDisplay === 'Windows' ? 'text-blue-400' : 'text-orange-400'}>{osDisplay}</span>
                        <span>{machine.difficulty_text}</span>
                      </div>
                    </button>
                  );
                })}
                {week.machines.length === 0 && (
                   <div className="col-span-full text-center py-4 text-foreground/30 font-mono text-sm border border-dashed border-white/10 rounded-sm">
                     No hay máquinas asignadas a esta semana.
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
