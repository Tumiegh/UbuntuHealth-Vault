import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  User, 
  ClipboardList, 
  Stethoscope, 
  ArrowRight,
  History,
  Bell,
  FileText,
  UserPlus,
  Activity,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const portals = [
  {
    id: "patient",
    title: "Patient Portal",
    subtitle: "Your Health, Your Control",
    description: "Manage your health records, control who sees your data, and track your medical history across all providers.",
    icon: User,
    color: "primary",
    features: [
      { icon: History, text: "Complete medical history timeline" },
      { icon: Bell, text: "Consent notifications & approvals" },
      { icon: FileText, text: "Download & share records" },
    ],
    cta: "Access Patient Portal",
    path: "/patient"
  },
  {
    id: "admin",
    title: "Admin Portal",
    subtitle: "Streamlined Check-In",
    description: "Efficiently manage patient registration, request consent, and coordinate with clinical staff.",
    icon: ClipboardList,
    color: "secondary",
    features: [
      { icon: UserPlus, text: "Quick patient registration" },
      { icon: Bell, text: "Send consent requests" },
      { icon: Activity, text: "Assign to available doctors" },
    ],
    cta: "Access Admin Portal",
    path: "/admin"
  },
  {
    id: "doctor",
    title: "Doctor Portal",
    subtitle: "Focus on What Matters",
    description: "Access patient records instantly with pre-loaded history, update notes, and complete consultations seamlessly.",
    icon: Stethoscope,
    color: "accent",
    features: [
      { icon: FileText, text: "Pre-loaded patient history" },
      { icon: Clock, text: "Quick clinical notes" },
      { icon: Activity, text: "One-click session completion" },
    ],
    cta: "Access Doctor Portal",
    path: "/doctor"
  }
];

const getColorClasses = (color: string) => {
  switch (color) {
    case "primary":
      return {
        gradient: "from-primary to-primary/70",
        glow: "shadow-glow",
        bg: "bg-primary/5 hover:bg-primary/10",
        border: "border-primary/20 hover:border-primary/40",
        text: "text-primary",
        button: "hero" as const
      };
    case "secondary":
      return {
        gradient: "from-secondary to-warning",
        glow: "shadow-amber",
        bg: "bg-secondary/5 hover:bg-secondary/10",
        border: "border-secondary/20 hover:border-secondary/40",
        text: "text-secondary",
        button: "heroSecondary" as const
      };
    case "accent":
      return {
        gradient: "from-accent to-warning",
        glow: "",
        bg: "bg-accent/5 hover:bg-accent/10",
        border: "border-accent/20 hover:border-accent/40",
        text: "text-accent",
        button: "heroSecondary" as const
      };
    default:
      return {
        gradient: "from-muted to-muted",
        glow: "",
        bg: "bg-muted",
        border: "border-border",
        text: "text-foreground",
        button: "default" as const
      };
  }
};

export function PortalsSection() {
  return (
    <section id="portals" className="py-24">
      <div className="container px-4 mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Three Portals, One Ecosystem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each role gets a tailored experience designed to eliminate friction
            and protect patient privacy at every step.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {portals.map((portal, index) => {
            const colors = getColorClasses(portal.color);
            return (
              <motion.div
                key={portal.id}
                className={`group relative rounded-2xl p-6 border ${colors.border} ${colors.bg} transition-all duration-300`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <portal.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <div className="space-y-3 mb-6">
                  <span className={`text-sm font-medium ${colors.text}`}>
                    {portal.subtitle}
                  </span>
                  <h3 className="text-2xl font-display font-bold">
                    {portal.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {portal.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {portal.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-card flex items-center justify-center">
                        <feature.icon className={`w-3.5 h-3.5 ${colors.text}`} />
                      </div>
                      <span className="text-sm">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to={portal.path}>
                  <Button variant={colors.button} className="w-full group/btn">
                    {portal.cta}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
