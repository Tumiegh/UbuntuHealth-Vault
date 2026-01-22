import { motion } from "framer-motion";
import { 
  Shield, 
  Database, 
  Cpu, 
  MessageSquare, 
  Server,
  Lock
} from "lucide-react";

const techItems = [
  {
    icon: Database,
    title: "Base L2",
    description: "Low-fee, high-scalability blockchain for consent management"
  },
  {
    icon: Lock,
    title: "DIDs",
    description: "Decentralized Identifiers for sovereign identity control"
  },
  {
    icon: Server,
    title: "IPFS + Edge Nodes",
    description: "Distributed storage on Raspberry Pi-based Ubuntu Nodes"
  },
  {
    icon: MessageSquare,
    title: "Africa's Talking",
    description: "USSD/SMS gateway for inclusive consent verification"
  },
  {
    icon: Cpu,
    title: "Node.js Relayer",
    description: "Gasless transactions via meta-transaction relay service"
  },
  {
    icon: Shield,
    title: "Zero-Knowledge",
    description: "Only encrypted hashes stored on-chain, full POPIA compliance"
  }
];

export function TechStackSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Built for Resilience & Privacy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our technical stack ensures your data remains secure, accessible, 
            and load-shedding proof across South Africa.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {techItems.map((item, index) => (
            <motion.div
              key={item.title}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="bg-card rounded-xl p-4 sm:p-6 border border-border h-full hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-display font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
