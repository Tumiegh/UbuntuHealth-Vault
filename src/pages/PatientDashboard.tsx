import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Bell, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  User,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const consentRequests = [
  {
    id: 1,
    institution: "Soweto General Clinic",
    requestedAt: "2 minutes ago",
    type: "Full Medical History",
    status: "pending"
  },
  {
    id: 2,
    institution: "Dr. Nkosi's Practice",
    requestedAt: "1 hour ago",
    type: "Recent Lab Results",
    status: "pending"
  }
];

const accessHistory = [
  {
    id: 1,
    institution: "Alexandra Community Hospital",
    accessedAt: "Yesterday, 14:30",
    duration: "45 min",
    doctor: "Dr. Thandiwe Mbeki"
  },
  {
    id: 2,
    institution: "Sandton Medical Centre",
    accessedAt: "3 days ago",
    duration: "20 min",
    doctor: "Dr. John Smith"
  }
];

const healthTimeline = [
  {
    id: 1,
    date: "15 Jan 2024",
    type: "Consultation",
    provider: "Dr. Thandiwe Mbeki",
    summary: "General check-up, blood pressure normal"
  },
  {
    id: 2,
    date: "10 Jan 2024",
    type: "Lab Results",
    provider: "PathCare Lab",
    summary: "Complete blood count - all values normal"
  },
  {
    id: 3,
    date: "5 Dec 2023",
    type: "Prescription",
    provider: "Dr. Nkosi",
    summary: "Chronic medication renewed for 3 months"
  }
];

const PatientDashboard = () => {
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold">Patient Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">Thabo Molefe</div>
                  <div className="text-xs text-muted-foreground">ID: 8501015800083</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 mx-auto py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Consent Requests */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
                <h2 className="text-lg sm:text-xl font-display font-semibold">Pending Consent Requests</h2>
                <span className="px-2 py-1 text-xs font-medium bg-warning/20 text-warning rounded-full w-fit">
                  {consentRequests.length} pending
                </span>
              </div>
              <div className="space-y-3">
                {consentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                          <h3 className="font-medium">{request.institution}</h3>
                          <p className="text-sm text-muted-foreground">
                            Requesting: {request.type}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {request.requestedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full sm:w-auto gap-2 sm:justify-end">
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                          Deny
                        </Button>
                        <Button variant="success" size="sm" className="flex-1 sm:flex-none">
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Health Timeline */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
                <h2 className="text-lg sm:text-xl font-display font-semibold">Health Timeline</h2>
                <Button variant="ghost" size="sm" className="w-fit">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {healthTimeline.map((event, index) => (
                  <div
                    key={event.id}
                    className={`p-4 flex items-start gap-4 ${
                      index !== healthTimeline.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{event.type}</span>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                          {event.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.provider}</p>
                      <p className="text-sm mt-2">{event.summary}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* Data Sovereignty Card */}
            <motion.div
              className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">Your Data Vault</h3>
                  <p className="text-sm text-muted-foreground">Fully encrypted & sovereign</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Records Stored</span>
                  <span className="font-medium">47 documents</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Consents</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">Today, 09:15</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Access */}
            <motion.div
              className="bg-card rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="font-display font-semibold mb-4">Recent Access</h3>
              <div className="space-y-4">
                {accessHistory.map((access) => (
                  <div key={access.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{access.institution}</p>
                      <p className="text-xs text-muted-foreground">{access.doctor}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{access.accessedAt}</span>
                      </div>
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

export default PatientDashboard;
