import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
    Shield,
    Target,
    Trophy,
    Users,
    Zap,
    BookOpen,
    ArrowRight,
    Lock,
    Code2,
    Clock,
    Terminal,
    Database,
    Cpu,
    Radio,
    Search,
    Shuffle,
    Calendar,
    Award,
    Lightbulb,
    Map,
} from "lucide-react";
import { useState } from "react";
import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/context/AuthContext";

export default function Features() {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    return (
        <Layout onLoginClick={() => setLoginModalOpen(true)}>
            {/* Key Features Section */}
            <section className="py-20 md:py-32 border-b border-primary/30 bg-card/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <div className="font-mono text-primary text-sm uppercase tracking-widest">
                            &gt; funcionalidades principales
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
                            <span className="glow-text">[CARACTERÍSTICAS]</span>
                        </h2>
                        <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-mono">
                            Herramientas para dominar la ciberseguridad
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: BookOpen,
                                title: "Tutoriales Detallados",
                                desc: "Guías paso a paso para cada máquina y exploit",
                                color: "text-primary border-primary/30",
                            },
                            {
                                icon: Trophy,
                                title: "Progreso Gamificado",
                                desc: "Puntos, badges y leaderboards por logros",
                                color: "text-secondary border-secondary/30",
                            },
                            {
                                icon: Map,
                                title: "Roadmaps por Certificación",
                                desc: "Caminos estructurados para CEH, OSCP y más",
                                color: "text-accent border-accent/30",
                            },
                            {
                                icon: Lightbulb,
                                title: "Notas con Timestamp",
                                desc: "Guarda apuntes con marcas de tiempo durante prácticas",
                                color: "text-primary border-primary/30",
                            },
                            {
                                icon: Calendar,
                                title: "Calendario de Progreso",
                                desc: "Visualiza tu consistencia y racha de entrenamiento",
                                color: "text-secondary border-secondary/30",
                            },
                            {
                                icon: Award,
                                title: "Certificaciones Tracked",
                                desc: "Prepárate y sigue el progreso hacia tus certs",
                                color: "text-accent border-accent/30",
                            },
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className={`glow-box p-6 border rounded-sm card-hover space-y-3 ${feature.color}`}
                            >
                                <div className="w-10 h-10 rounded-sm bg-background/50 flex items-center justify-center">
                                    <feature.icon
                                        className={`w-6 h-6 ${feature.color.split(" ")[0]}`}
                                    />
                                </div>
                                <h3 className="text-lg font-bold font-mono uppercase tracking-wide">
                                    {feature.title}
                                </h3>
                                <p className="text-foreground/70 text-sm font-mono">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 md:py-32 border-b border-primary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <div className="font-mono text-secondary text-sm uppercase tracking-widest">
                            &gt; flujo de trabajo
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
                            Tu Entrenamiento
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            {
                                step: "01",
                                title: "Busca & Filtra",
                                desc: "Encuentra máquinas por técnica, dificultad o certificación",
                            },
                            {
                                step: "02",
                                title: "Estudia",
                                desc: "Accede a tutoriales y documentación detallada",
                            },
                            {
                                step: "03",
                                title: "Practica",
                                desc: "Exploita la máquina y toma notas durante el proceso",
                            },
                            {
                                step: "04",
                                title: "Aprende",
                                desc: "Gana puntos, badges y avanza en tu roadmap",
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="relative">
                                <div className="glow-box p-6 border-primary/30 neon-border rounded-sm space-y-4">
                                    <div className="text-4xl font-bold text-primary/30 font-mono">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold font-mono uppercase tracking-wide text-primary mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-foreground/70 font-mono">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                                {idx < 3 && (
                                    <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                                        <ArrowRight className="w-6 h-6 text-primary/30" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Only show if not authenticated */}
            {!isAuthenticated && (
                <section className="py-20 md:py-32 border-t border-primary/30 bg-gradient-to-b from-primary/5 to-secondary/5">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                        <div className="space-y-4 font-mono">
                            <div className="text-primary uppercase tracking-widest text-sm">
                                &gt; ready
                            </div>
                            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
                                <span className="glow-text">COMIENZA YA</span>
                            </h2>
                            <p className="text-xl text-foreground/70">
                                Únete a miles de hackers éticos. Acceso gratuito a máquinas
                                principiantes.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => setLoginModalOpen(true)}
                                className="button-glow bg-primary text-background hover:bg-primary/90 text-base h-12 px-8 font-mono uppercase tracking-widest rounded-sm"
                            >
                                $ acceso
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setLoginModalOpen(true)}
                                className="neon-border text-base h-12 px-8 font-mono uppercase tracking-widest rounded-sm hover:bg-card/50 hover:shadow-lg hover:shadow-primary/20"
                            >
                                $ explora
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />
        </Layout>
    );
}
