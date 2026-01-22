import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Users, Zap, ArrowRight } from "lucide-react";
import { NetworkVisualization } from "./NetworkVisualization";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-mesh">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 pt-20 pb-16 mx-auto">
        {/* Navigation */}
        <motion.nav
          className="flex items-center justify-between mb-10 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">UbuntuHealth</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#portals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Portals
            </a>
            <a href="#network" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              DePIN Network
            </a>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </div>
        </motion.nav>

        {/* Mobile quick actions */}
        <div className="md:hidden mb-10 flex gap-3">
          <a href="#portals" className="flex-1">
            <Button variant="hero" className="w-full">
              Explore Portals
            </Button>
          </a>
          <a href="#how-it-works" className="flex-1">
            <Button variant="portal" className="w-full">
              Workflow
            </Button>
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left column - Text */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Powered by Base L2 & DePIN
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Your Health Data,{" "}
              <span className="text-gradient-primary">Your Sovereignty</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              UbuntuHealth Vault eliminates the administrative tax on healthcare. 
              Doctors focus on patients while communities own their medical history 
              through a resilient, load-shedding-proof decentralized network.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                Launch Patient Portal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="portal" size="xl" className="w-full sm:w-auto">
                I'm a Healthcare Provider
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4">
              <div>
                <div className="text-3xl font-display font-bold text-primary">40%</div>
                <div className="text-sm text-muted-foreground">Less Admin Time</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-secondary">100%</div>
                <div className="text-sm text-muted-foreground">Data Ownership</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Network Uptime</div>
              </div>
            </div>
          </motion.div>

          {/* Right column - Network Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            <NetworkVisualization />
            
            {/* Floating cards */}
            <motion.div
              className="hidden sm:block absolute -left-4 top-1/4 bg-card rounded-xl p-4 shadow-lg border border-border max-w-[200px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-success" />
                </div>
                <span className="text-sm font-medium">POPIA Compliant</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Zero-knowledge encryption ensures your data stays yours
              </p>
            </motion.div>

            <motion.div
              className="hidden sm:block absolute -right-4 bottom-1/4 bg-card rounded-xl p-4 shadow-lg border border-border max-w-[200px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-sm font-medium">Ubuntu Nodes</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Community-owned infrastructure across South Africa
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
