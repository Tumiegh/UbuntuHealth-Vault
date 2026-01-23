import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Network, Zap, ArrowLeft, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ComingSoon() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when the DePIN Network launches.",
      });
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container px-4 mx-auto py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 mx-auto py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                >
                  <Network className="w-16 h-16 text-primary" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center"
                >
                  <Zap className="w-6 h-6 text-accent-foreground" />
                </motion.div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold">
                DePIN Network
                <span className="block text-gradient-primary mt-2">Coming Soon</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're building a decentralized physical infrastructure network that will revolutionize 
                healthcare data storage across South Africa.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <Shield className="w-10 h-10 text-primary mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Load-Shedding Proof</h3>
                <p className="text-sm text-muted-foreground">
                  Distributed nodes ensure 24/7 uptime even during power outages
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <Network className="w-10 h-10 text-secondary mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Community Owned</h3>
                <p className="text-sm text-muted-foreground">
                  Ubuntu philosophy - your community hosts and secures your data
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <Zap className="w-10 h-10 text-accent mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Edge computing brings data closer to you for instant access
                </p>
              </motion.div>
            </div>

            {/* Notify Me Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-8"
            >
              <div className="bg-muted/50 rounded-2xl p-8 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Get Notified</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Be the first to know when we launch the DePIN Network
                </p>
                <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <Button type="submit" variant="hero">
                    Notify Me
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

