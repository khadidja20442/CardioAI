import logo from "@/assets/cardioai-logo.png";

const Footer = () => (
  <footer id="contact" className="bg-foreground text-primary-foreground/70 py-14">
    <div className="container max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2.5 mb-3">
            <img src={logo} alt="CardioAI" className="h-8 w-auto brightness-0 invert opacity-80" />
            <span className="font-display font-bold text-lg text-primary-foreground">
              Cardio<span className="text-primary">AI</span>
            </span>
          </div>
          <p className="text-sm max-w-xs text-center md:text-left leading-relaxed">
            AI-powered cardiovascular risk screening — empowering clinicians with data-driven insights for better patient outcomes.
          </p>
        </div>

        <div className="flex gap-8 text-sm">
          <a href="#home" className="hover:text-primary-foreground transition-colors">Home</a>
          <a href="#assessment" className="hover:text-primary-foreground transition-colors">Assessment</a>
          <a href="#pricing" className="hover:text-primary-foreground transition-colors">Pricing</a>
          <a href="#about" className="hover:text-primary-foreground transition-colors">About</a>
          <span className="text-primary-foreground/40 cursor-default">Privacy</span>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-xs text-primary-foreground/40">
        © {new Date().getFullYear()} CardioAI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
