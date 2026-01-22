import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  FileText,
  Clock,
  CheckCircle,
  ArrowLeft,
  User,
  Stethoscope,
  AlertCircle,
  History,
  Pill,
  HeartPulse,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock patient data
const currentPatient = {
  id: 1,
  name: "Thabo Molefe",
  idNumber: "8501015800083",
  age: 39,
  gender: "Male",
  bloodType: "O+",
  allergies: ["Penicillin"],
  chronicConditions: ["Hypertension (controlled)"],
  currentMedications: ["Amlodipine 5mg daily"],
  sessionStartTime: "10:15"
};

const medicalHistory = [
  {
    id: 1,
    date: "15 Jan 2024",
    type: "Consultation",
    provider: "Dr. Thandiwe Mbeki",
    summary: "General check-up, blood pressure normal at 120/80",
    vitals: { bp: "120/80", hr: "72", temp: "36.5°C" }
  },
  {
    id: 2,
    date: "10 Jan 2024",
    type: "Lab Results",
    provider: "PathCare Lab",
    summary: "Complete blood count - all values normal",
    results: "WBC: 7.2, RBC: 4.8, HGB: 14.2"
  },
  {
    id: 3,
    date: "5 Dec 2023",
    type: "Consultation",
    provider: "Dr. Nkosi",
    summary: "Chronic medication review, BP well controlled",
    vitals: { bp: "118/78", hr: "68", temp: "36.4°C" }
  }
];

const waitingQueue = [
  { id: 2, name: "Nomzamo Dlamini", waitTime: "15 min", reason: "Follow-up" },
  { id: 3, name: "Sipho Ndlovu", waitTime: "25 min", reason: "Lab review" },
];

const DoctorDashboard = () => {
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [expandedHistory, setExpandedHistory] = useState<number | null>(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 sm:py-0 sm:h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-warning flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="font-display font-bold">Doctor Portal</span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-sm text-muted-foreground truncate">Dr. Thandiwe Mbeki</span>
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 mx-auto py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Patient Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Patient Card */}
            <motion.div
              className="bg-gradient-to-br from-accent/10 to-warning/5 rounded-2xl p-6 border border-accent/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
                    <User className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold">{currentPatient.name}</h2>
                    <p className="text-sm text-muted-foreground">ID: {currentPatient.idNumber}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                      <span>{currentPatient.age} years</span>
                      <span>{currentPatient.gender}</span>
                      <span className="font-medium">{currentPatient.bloodType}</span>
                    </div>
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-success/20 text-success rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    Active Session
                  </span>
                  <p className="text-xs text-muted-foreground mt-2">
                    Started: {currentPatient.sessionStartTime}
                  </p>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium">Allergies</span>
                  </div>
                  <p className="text-sm">{currentPatient.allergies.join(", ") || "None known"}</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Conditions</span>
                  </div>
                  <p className="text-sm">{currentPatient.chronicConditions.join(", ") || "None"}</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium">Medications</span>
                  </div>
                  <p className="text-sm">{currentPatient.currentMedications.join(", ") || "None"}</p>
                </div>
              </div>
            </motion.div>

            {/* Medical History */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-display font-semibold">Medical History</h3>
              </div>
              <div className="space-y-3">
                {medicalHistory.map((record) => (
                  <div
                    key={record.id}
                    className="bg-card rounded-xl border border-border overflow-hidden"
                  >
                    <button
                      className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedHistory(expandedHistory === record.id ? null : record.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{record.type}</span>
                            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                              {record.date}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{record.provider}</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedHistory === record.id ? "rotate-180" : ""}`} />
                    </button>
                    {expandedHistory === record.id && (
                      <motion.div
                        className="px-4 pb-4 border-t border-border"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="pt-4">
                          <p className="text-sm mb-3">{record.summary}</p>
                          {record.vitals && (
                            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs">
                              <span className="px-2 py-1 bg-muted rounded">BP: {record.vitals.bp}</span>
                              <span className="px-2 py-1 bg-muted rounded">HR: {record.vitals.hr}</span>
                              <span className="px-2 py-1 bg-muted rounded">Temp: {record.vitals.temp}</span>
                            </div>
                          )}
                          {record.results && (
                            <p className="text-xs text-muted-foreground mt-2">{record.results}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Clinical Notes */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="text-lg font-display font-semibold mb-4">Clinical Notes</h3>
              <div className="bg-card rounded-xl p-4 border border-border">
                <Textarea
                  placeholder="Enter consultation notes..."
                  className="min-h-[150px] resize-none border-0 focus-visible:ring-0 p-0"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Auto-saved to encrypted vault
                  </span>
                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                      <Button variant="outline" className="w-full sm:w-auto">Add Prescription</Button>
                      <Button variant="success" size="lg" className="w-full sm:w-auto">
                      <CheckCircle className="w-4 h-4" />
                      Complete Session
                    </Button>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right column - Queue */}
          <div className="space-y-6">
            {/* Session Info */}
            <motion.div
              className="bg-card rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold">Access Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Consent Type</span>
                  <span className="font-medium">Full Medical History</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Valid Until</span>
                  <span className="font-medium">Session End</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Granted By</span>
                  <span className="font-medium">Patient via SMS</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
                Access will be automatically revoked when you complete the session.
              </p>
            </motion.div>

            {/* Waiting Queue */}
            <motion.div
              className="bg-card rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">Up Next</h3>
                <span className="text-xs text-muted-foreground">{waitingQueue.length} waiting</span>
              </div>
              <div className="space-y-3">
                {waitingQueue.map((patient, index) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.reason}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {patient.waitTime}
                    </div>
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

export default DoctorDashboard;
