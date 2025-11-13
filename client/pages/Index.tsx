import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Shield, Target, Trophy, Users, Zap, BookOpen, ArrowRight, Lock, Code2, Clock, Terminal, Database, Cpu, Radio } from "lucide-react";
import { useState, useEffect } from "react";

function Typewriter({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return <span>{displayedText}</span>;
}

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: "1s"}} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-float-up">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-mono text-sm">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span className="uppercase tracking-widest">System online</span>
                </div>
                <h1 className="text-6xl md:text-7xl font-bold tracking-tighter">
                  <span className="glow-text">[VAULT]</span>
                </h1>
                <div className="space-y-2 font-mono text-base">
                  <p className="text-primary glow-text">$ init ethical-hacking</p>
                  <p className="text-foreground/70 text-sm">
                    Practice on real vulnerable machines<br/>
                    Earn industry certifications<br/>
                    Become a cybersecurity expert
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="button-glow bg-primary text-background hover:bg-primary/90 text-base h-12 px-8 font-mono uppercase tracking-widest rounded-sm">
                  $ start
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="neon-border text-base h-12 px-8 font-mono uppercase tracking-widest rounded-sm hover:bg-card/50 hover:shadow-lg hover:shadow-primary/20">
                  $ explore
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4 font-mono">
                <div className="glow-box p-4 border-primary/40 neon-border rounded-sm">
                  <div className="text-2xl font-bold text-primary glow-text">500+</div>
                  <p className="text-xs text-foreground/60 uppercase">Machines</p>
                </div>
                <div className="glow-box p-4 border-secondary/40 neon-border rounded-sm">
                  <div className="text-2xl font-bold text-secondary glow-text-secondary">50K+</div>
                  <p className="text-xs text-foreground/60 uppercase">Hackers</p>
                </div>
                <div className="glow-box p-4 border-accent/40 neon-border rounded-sm">
                  <div className="text-2xl font-bold text-accent">∞</div>
                  <p className="text-xs text-foreground/60 uppercase">Access</p>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="glow-box border-primary/30 neon-border p-6 space-y-4 rounded-sm font-mono text-sm">
                <div className="flex items-center justify-between text-xs text-primary/70">
                  <span className="uppercase tracking-widest">Terminal</span>
                  <span className="text-primary glow-text animate-terminal-blink">●</span>
                </div>
                <div className="space-y-3 text-foreground/70">
                  <div><span className="text-primary">$</span> <span className="text-secondary">nmap</span> -sV 192.168.1.100</div>
                  <div className="text-xs">Starting Nmap 7.92 ( https://nmap.org )</div>
                  <div className="text-xs">Nmap scan report for 192.168.1.100</div>
                  <div className="text-xs">Host is up (0.024s latency)</div>
                  <div className="text-primary/80">22/tcp open ssh OpenSSH 7.4</div>
                  <div className="text-primary/80">80/tcp open http Apache httpd 2.4.6</div>
                  <div className="text-primary/80">443/tcp open https</div>
                  <div className="text-xs mt-2 text-accent">3389/tcp open rdp</div>
                </div>
                <div className="border-t border-primary/20 pt-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-glow-pulse" />
                  <span className="text-xs text-foreground/60 uppercase">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 border-t border-primary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="font-mono text-primary text-sm uppercase tracking-widest">
              &gt; capabilities
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
              <span className="glow-text">[FEATURES]</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-mono">
              Everything needed to master cybersecurity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Machines", desc: "Real-world vulnerabilities in safe sandbox", color: "text-primary" },
              { icon: Trophy, title: "Certifications", desc: "CEH, OSCP, Security+ preparation paths", color: "text-secondary" },
              { icon: Users, title: "Community", desc: "50K+ ethical hackers sharing knowledge", color: "text-accent" },
              { icon: BookOpen, title: "Learning", desc: "Tutorials, guides, and comprehensive docs", color: "text-primary" },
              { icon: Code2, title: "Challenges", desc: "Exploit writing and security challenges", color: "text-secondary" },
              { icon: Zap, title: "Progress", desc: "Track your journey and achievements", color: "text-accent" },
            ].map((feature, idx) => (
              <div key={idx} className="group glow-box p-6 border-primary/20 rounded-sm card-hover space-y-3">
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold font-mono uppercase tracking-wide">{feature.title}</h3>
                <p className="text-foreground/70 text-sm font-mono">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Machines Section */}
      <section id="machines" className="py-20 md:py-32 border-t border-primary/30 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="font-mono text-primary text-sm uppercase tracking-widest mb-2">&gt; execution</div>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">
                  <span className="glow-text">LEARN</span><br/><span className="text-foreground">BY DOING</span>
                </h2>
                <p className="text-lg text-foreground/70 font-mono">
                  From beginner to insane difficulty. Start with fundamentals, progress to advanced exploitation.
                </p>
              </div>

              <div className="space-y-3 font-mono">
                {[
                  { icon: Lock, title: "Reverse Engineering", desc: "Analyze binaries and security mechanisms" },
                  { icon: Code2, title: "Web Exploitation", desc: "SQL injection, XSS, and modern vulns" },
                  { icon: Shield, title: "Privilege Escalation", desc: "Elevate access on target systems" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 glow-box p-4 border-primary/20 rounded-sm hover:border-primary/50 transition-all">
                    <div className="flex-shrink-0 text-primary">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wide">{item.title}</h4>
                      <p className="text-xs text-foreground/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="button-glow bg-primary text-background hover:bg-primary/90 text-base h-12 px-8 w-full md:w-auto font-mono uppercase tracking-widest rounded-sm">
                $ execute
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4 font-mono">
              {[
                { title: "Linux Privesc", users: "1,234", difficulty: "Intermediate", diffColor: "text-secondary" },
                { title: "WAF Bypass", users: "789", difficulty: "Advanced", diffColor: "text-accent" },
                { title: "AD Enumeration", users: "3,456", difficulty: "Beginner", diffColor: "text-primary" },
              ].map((machine, idx) => (
                <div key={idx} className="glow-box p-5 border-primary/20 rounded-sm card-hover space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wide">{machine.title}</h4>
                      <p className="text-xs text-foreground/60 mt-1 font-mono">Practice machine</p>
                    </div>
                    <span className={`px-2 py-1 rounded-sm bg-background text-xs font-semibold uppercase tracking-wider ${machine.diffColor}`}>
                      {machine.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground/60 font-mono">
                    <Users className="w-4 h-4" />
                    <span>{machine.users} completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 md:py-32 border-t border-primary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="font-mono text-primary text-sm uppercase tracking-widest">
              &gt; credentials
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
              <span className="glow-text">[CERTIFICATIONS]</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-mono">
              Industry-recognized credentials employers are looking for
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { 
                icon: Trophy, 
                title: "CEH v12", 
                color: "border-primary/40 neon-border",
                desc: "Certified Ethical Hacker is the industry standard",
                items: ["Complete exam prep", "50+ practice machines", "Video tutorials"]
              },
              { 
                icon: Shield, 
                title: "OSCP", 
                color: "border-secondary/40 neon-border",
                desc: "Most respected credential in cybersecurity",
                items: ["Advanced labs", "Real-world scenarios", "Report writing"]
              },
            ].map((cert, idx) => (
              <div key={idx} className={`glow-box p-8 rounded-sm space-y-4 ${cert.color}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                    <cert.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-mono uppercase tracking-wide">{cert.title}</h3>
                </div>
                <p className="text-foreground/70 text-sm font-mono">{cert.desc}</p>
                <ul className="space-y-2 text-sm font-mono">
                  {cert.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground/70">
                      <span className="text-primary">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full button-glow bg-primary text-background hover:bg-primary/90 font-mono uppercase tracking-widest rounded-sm mt-4">
                  $ explore
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t border-primary/30 bg-gradient-to-b from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4 font-mono">
            <div className="text-primary uppercase tracking-widest text-sm">
              &gt; ready
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
              <span className="glow-text">LEVEL UP</span>
            </h2>
            <p className="text-xl text-foreground/70">
              Join 50K+ ethical hackers. Start with free machines and unlock premium content.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="button-glow bg-primary text-background hover:bg-primary/90 text-base h-12 px-8 font-mono uppercase tracking-widest rounded-sm">
              $ access
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="neon-border text-base h-12 px-8 font-mono uppercase tracking-widest rounded-sm hover:bg-card/50 hover:shadow-lg hover:shadow-primary/20">
              $ browse
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-primary/30 font-mono">
            {[
              { icon: Zap, title: "Free Tier", desc: "50+ beginner machines" },
              { icon: Clock, title: "Lifetime", desc: "Keep your progress forever" },
              { icon: Database, title: "Community", desc: "50K+ hackers worldwide" },
            ].map((feature, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <feature.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">{feature.title}</span>
                </div>
                <p className="text-sm text-foreground/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
