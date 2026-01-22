import { HeroSection } from "@/components/HeroSection";
import { WorkflowSection } from "@/components/WorkflowSection";
import { PortalsSection } from "@/components/PortalsSection";
import { TechStackSection } from "@/components/TechStackSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <WorkflowSection />
      <PortalsSection />
      <TechStackSection />
      <Footer />
    </main>
  );
};

export default Index;
