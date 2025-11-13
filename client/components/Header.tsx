import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
              <Shield className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold gradient-text">Hacking Vault</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              Features
            </a>
            <a href="#machines" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              Machines
            </a>
            <a href="#certifications" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              Certifications
            </a>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" className="text-sm">
              Sign In
            </Button>
            <Button className="text-sm button-glow bg-primary text-background hover:bg-primary/90">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-card rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-slide-up">
            <a
              href="#features"
              className="block px-4 py-2 rounded-lg hover:bg-card transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#machines"
              className="block px-4 py-2 rounded-lg hover:bg-card transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              Machines
            </a>
            <a
              href="#certifications"
              className="block px-4 py-2 rounded-lg hover:bg-card transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              Certifications
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" className="w-full text-sm">
                Sign In
              </Button>
              <Button className="w-full text-sm button-glow bg-primary text-background hover:bg-primary/90">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
