import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/cardioai-logo.png";
import UserMenu from "@/components/UserMenu";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Risk Assessment", href: "#assessment" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-16 max-w-6xl mx-auto px-4">
        <a href="#home" className="flex items-center gap-2.5">
          <img src={logo} alt="CardioAI" className="h-9 w-auto" />
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            Cardio<span className="text-primary">AI</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <UserMenu />
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 animate-reveal">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-3">
            <UserMenu />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
