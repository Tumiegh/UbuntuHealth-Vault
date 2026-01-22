import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  UserPlus,
  Search,
  Send,
  Users,
  Clock,
  CheckCircle,
  ArrowLeft,
  User,
  Stethoscope
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const waitingPatients = [
  {
    id: 1,
    name: "Thabo Molefe",
    idNumber: "8501015800083",
    checkInTime: "09:15",
    status: "awaiting_consent",
    reason: "General check-up"
  },
  {
    id: 2,
    name: "Nomzamo Dlamini",
    idNumber: "9203124800082",
    checkInTime: "09:30",
    status: "consent_granted",
    reason: "Follow-up"
  },
  {
    id: 3,
    name: "Sipho Ndlovu",
    idNumber: "7809085800087",
    checkInTime: "09:45",
    status: "with_doctor",
    doctor: "Dr. Mbeki",
    reason: "Lab results review"
  }
];

const availableDoctors = [
  { id: 1, name: "Dr. Thandiwe Mbeki", specialty: "General Practice", available: true, currentPatients: 1 },
  { id: 2, name: "Dr. John Smith", specialty: "Internal Medicine", available: true, currentPatients: 0 },
  { id: 3, name: "Dr. Priya Naidoo", specialty: "Pediatrics", available: false, currentPatients: 2 },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "awaiting_consent":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-warning/20 text-warning rounded-full">
          <Clock className="w-3 h-3" />
          Awaiting Consent
        </span>
      );
    case "consent_granted":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-success/20 text-success rounded-full">
          <CheckCircle className="w-3 h-3" />
          Ready to Assign
        </span>
      );
    case "with_doctor":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
          <Stethoscope className="w-3 h-3" />
          With Doctor
        </span>
      );
    default:
      return null;
  }
};

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-warning flex items-center justify-center">
                  <Users className="w-4 h-4 text-secondary-foreground" />
                </div>
                <span className="font-display font-bold">Admin Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Soweto General Clinic</span>
              <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 mx-auto py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Patient Queue */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID number..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="heroSecondary" className="shrink-0">
                <UserPlus className="w-4 h-4" />
                New Check-In
              </Button>
            </motion.div>

            {/* Waiting Queue */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-semibold">Patient Queue</h2>
                <span className="text-sm text-muted-foreground">
                  {waitingPatients.length} patients today
                </span>
              </div>
              <div className="space-y-3">
                {waitingPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`bg-card rounded-xl p-4 border transition-all cursor-pointer ${
                      selectedPatient === patient.id
                        ? "border-secondary shadow-lg"
                        : "border-border hover:border-secondary/50"
                    }`}
                    onClick={() => setSelectedPatient(patient.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {patient.idNumber}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {patient.reason}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(patient.status)}
                        <p className="text-xs text-muted-foreground mt-2">
                          Check-in: {patient.checkInTime}
                        </p>
                        {patient.doctor && (
                          <p className="text-xs text-primary mt-1">{patient.doctor}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions based on status */}
                    {patient.status === "awaiting_consent" && (
                      <div className="mt-4 pt-4 border-t border-border flex gap-2">
                        <Button variant="secondary" size="sm" className="flex-1">
                          <Send className="w-4 h-4" />
                          Send SMS Reminder
                        </Button>
                      </div>
                    )}
                    {patient.status === "consent_granted" && selectedPatient === patient.id && (
                      <motion.div
                        className="mt-4 pt-4 border-t border-border"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-sm font-medium mb-3">Assign to Doctor:</p>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {availableDoctors.filter(d => d.available).map((doctor) => (
                            <Button
                              key={doctor.id}
                              variant="outline"
                              size="sm"
                              className="justify-start"
                            >
                              <Stethoscope className="w-4 h-4 text-primary" />
                              {doctor.name}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right column - Stats & Doctors */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <motion.div
              className="bg-gradient-to-br from-secondary/10 to-warning/10 rounded-2xl p-6 border border-secondary/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="font-display font-semibold mb-4">Today's Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Check-ins</span>
                  <span className="text-2xl font-display font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="text-2xl font-display font-bold text-success">9</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">In Queue</span>
                  <span className="text-2xl font-display font-bold text-warning">3</span>
                </div>
              </div>
            </motion.div>

            {/* Available Doctors */}
            <motion.div
              className="bg-card rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="font-display font-semibold mb-4">Medical Staff</h3>
              <div className="space-y-3">
                {availableDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${doctor.available ? "bg-success" : "bg-muted-foreground"}`} />
                      <div>
                        <p className="text-sm font-medium">{doctor.name}</p>
                        <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {doctor.currentPatients} patient{doctor.currentPatients !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
