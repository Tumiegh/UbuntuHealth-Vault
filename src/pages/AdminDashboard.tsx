import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Stethoscope,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { submitCheckIn } from "@/api/checkinService";
import { useToast } from "@/hooks/use-toast";
import { fetchSMSReplies, markSMSReplyAsProcessed, sendConfirmationSMS } from "@/api/smsService";

/**
 * Initial mock data for patients waiting in the queue
 * Each patient has a unique ID, personal details, check-in time, status, and reason for visit
 */
const initialWaitingPatients = [
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

/**
 * Generates a status badge component based on patient's current status
 * @param {string} status - The patient's current status in the queue
 * @returns {JSX.Element | null} A styled badge component or null if status is unknown
 */
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

// Normalize phone number by removing spaces and special characters
const normalizePhoneNumber = (phone: string) => {
  return phone.replace(/[\s\-\(\)]/g, '');
};

const AdminDashboard = () => {
  const { toast } = useToast();

  // Search query state for filtering patients
  const [searchQuery, setSearchQuery] = useState("");
  
  // Track which patient is currently selected in the queue
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  
  // Dialog open/close state for New Check-In form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Loading state while submitting check-in request
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dynamic patient queue state - starts with initial mock data
  const [waitingPatients, setWaitingPatients] = useState(() => {
    const stored = localStorage.getItem("waitingPatients");
    return stored ? JSON.parse(stored) : initialWaitingPatients;
  });
  const [completedPatients, setCompletedPatients] = useState<any[]>(() => {
    const stored = localStorage.getItem("completedPatients");
    return stored ? JSON.parse(stored) : [];
  });

  // Track phone number to patient ID mapping for SMS replies
  const [phoneToPatientMap, setPhoneToPatientMap] = useState(() => {
    const stored = localStorage.getItem("phoneToPatientMap");
    return stored ? JSON.parse(stored) : {};
  });
  
  // Form data for new check-in request
  const [formData, setFormData] = useState({
    patientName: "",
    phoneNumber: "",
    idNumber: "",
  });

  const handleAssignToDoctor = (patientId: number, doctorId: number, doctorName: string) => {
    setWaitingPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, status: 'with_doctor', doctor: doctorName }
          : patient
      )
    );
    
    // Update localStorage to sync with doctor dashboard
    const assignmentUpdate = {
      patientId,
      doctorId,
      doctorName,
      status: 'with_doctor',
      timestamp: new Date().toISOString()
    };
    
    const existingAssignments = JSON.parse(localStorage.getItem('doctorAssignments') || '[]');
    localStorage.setItem('doctorAssignments', JSON.stringify([...existingAssignments, assignmentUpdate]));
    
    alert(`Patient assigned to ${doctorName}`);
  };

  // Persist waiting patients to localStorage
  useEffect(() => {
    localStorage.setItem("waitingPatients", JSON.stringify(waitingPatients));
  }, [waitingPatients]);

  // Persist completed patients to localStorage
  useEffect(() => {
    localStorage.setItem("completedPatients", JSON.stringify(completedPatients));
  }, [completedPatients]);

  // Persist phone to patient mapping to localStorage
  useEffect(() => {
    localStorage.setItem("phoneToPatientMap", JSON.stringify(phoneToPatientMap));
  }, [phoneToPatientMap]);

  // Poll for SMS replies and update patient status
  useEffect(() => {
    const pollSMSReplies = async () => {
      try {
        console.log("🔄 Starting SMS polling...");
        
        // Fetch only unprocessed replies
        const response = await fetchSMSReplies({ processed: false });
        
        console.log("📱 Polling for SMS replies...");
        console.log("Current phoneToPatientMap:", phoneToPatientMap);
        console.log("API Response:", response);
        
        // Extract replies array from response object
        const replies = response?.replies || [];
        
        console.log("Unprocessed replies array:", replies);
        console.log("Waiting patients:", waitingPatients);
        
        if (!replies || replies.length === 0) {
          console.log("No unprocessed replies found");
          return;
        }

        console.log(`Found ${replies.length} unprocessed replies`);
        
        for (const reply of replies) {
          try {
            console.log(`\n📨 Processing reply:`, reply);
            
            const phoneNumber = normalizePhoneNumber(reply.phoneNumber);
            const response = reply.response?.toUpperCase();
            
            console.log(`Normalized phone: ${phoneNumber}, Response: ${response}`);
            
            // Check all normalized keys in the map
            let patientId = null;
            for (const mapPhone in phoneToPatientMap) {
              if (normalizePhoneNumber(mapPhone) === phoneNumber) {
                patientId = phoneToPatientMap[mapPhone];
                console.log(`✓ Found matching phone in map: ${mapPhone} → Patient ID ${patientId}`);
                break;
              }
            }

            console.log(`Checking reply from ${reply.phoneNumber} (normalized: ${phoneNumber}): ${response} → Patient ID: ${patientId}`);

            if (!patientId) {
              console.warn(`⚠️ No patient found for phone: ${reply.phoneNumber}`);
              continue;
            }

            if (reply.processed) {
              console.log(`⏭️ Reply already processed, skipping`);
              continue;
            }

            const patient = waitingPatients.find(p => p.id === patientId);
            
            if (!patient) {
              console.warn(`⚠️ Patient with ID ${patientId} not found in waitingPatients`);
              continue;
            }
            
            console.log(`✓ Found patient: ${patient.name}`);
            
            if (response === "YES") {
              console.log(`✅ Processing YES response for patient ${patient.name}`);
              
              // Update status to consent_granted
              setWaitingPatients(prev => {
                const updated = prev.map(p =>
                  p.id === patientId ? { ...p, status: "consent_granted" } : p
                );
                console.log("Updated waitingPatients:", updated);
                return updated;
              });

              toast({
                title: "Access Granted ✓",
                description: `${patient.name} has given consent. Access has been granted to the institution.`,
                duration: 5000,
              });

              // Send confirmation SMS to patient
              try {
                console.log(`📤 Sending confirmation SMS to ${reply.phoneNumber}...`);
                await sendConfirmationSMS(reply.phoneNumber, patient.name, "YES");
                console.log(`✓ Confirmation SMS sent to ${reply.phoneNumber}`);
              } catch (smsError) {
                console.error("❌ Error sending confirmation SMS:", smsError);
              }

              // Mark reply as processed to avoid re-processing
              try {
                console.log(`⏱️ Marking reply ${reply.id} as processed...`);
                await markSMSReplyAsProcessed(reply.id);
                console.log(`✓ Marked reply ${reply.id} as processed`);
              } catch (markError) {
                console.error("❌ Error marking reply as processed:", markError);
              }
            } else if (response === "NO") {
              console.log(`❌ Processing NO response for patient ${patient.name}`);
              
              // Remove patient from queue
              setWaitingPatients(prev => {
                const updated = prev.filter(p => p.id !== patientId);
                console.log("Updated waitingPatients after removal:", updated);
                return updated;
              });
              
              setCompletedPatients(prev => {
                const updated = [
                  ...prev,
                  { ...patient, completedAt: new Date().toLocaleTimeString(), status: "declined" }
                ];
                console.log("Updated completedPatients:", updated);
                return updated;
              });

              toast({
                title: "Access Declined ✗",
                description: `${patient.name} has declined access. No access has been given to the institution.`,
                duration: 5000,
              });

              // Send confirmation SMS to patient
              try {
                console.log(`📤 Sending confirmation SMS to ${reply.phoneNumber}...`);
                await sendConfirmationSMS(reply.phoneNumber, patient.name, "NO");
                console.log(`✓ Confirmation SMS sent to ${reply.phoneNumber}`);
              } catch (smsError) {
                console.error("❌ Error sending confirmation SMS:", smsError);
              }

              // Mark reply as processed to avoid re-processing
              try {
                console.log(`⏱️ Marking reply ${reply.id} as processed...`);
                await markSMSReplyAsProcessed(reply.id);
                console.log(`✓ Marked reply ${reply.id} as processed`);
              } catch (markError) {
                console.error("❌ Error marking reply as processed:", markError);
              }
            } else {
              console.warn(`⚠️ Invalid response format: ${response}`);
            }
          } catch (replyError) {
            console.error("Error processing individual reply:", replyError);
          }
        }
      } catch (error) {
        console.error("❌ Error in polling function:", error);
      }
    };

    const interval = setInterval(pollSMSReplies, 5000);
    // Run immediately on mount
    pollSMSReplies();
    return () => clearInterval(interval);
  }, [phoneToPatientMap, waitingPatients, completedPatients, toast]);

  // Error message state for form validation
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Handles input field changes in the check-in form
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
   */
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Submits the check-in request to the backend API
   * - Validates required fields (patient name and phone number)
   * - Calls backend API to send SMS access request via Africa's Talking
   * - Adds a new patient to the waiting queue with "awaiting_consent" status
   * - Resets the form and closes the dialog on success
   * - Displays error messages if validation or API call fails
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmitCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!formData.patientName || !formData.phoneNumber) {
      setErrorMessage("Please fill in patient name and phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      // Call backend API to send SMS and validate phone number
      const response = await submitCheckIn({
        patientName: formData.patientName,
        phoneNumber: formData.phoneNumber,
        idNumber: formData.idNumber || undefined,
      });

      if (!response.success) {
        setErrorMessage(response.error || "Failed to send access request");
        return;
      }

      // Get current timestamp for check-in time
      const now = new Date();
      const checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // Create new patient object with check-in details
      const newPatient = {
        id: Math.max(...waitingPatients.map(p => p.id), 0) + 1,
        name: formData.patientName,
        idNumber: formData.idNumber || "Not provided",
        checkInTime: checkInTime,
        status: "awaiting_consent" as const,
        reason: "New check-in"
      };
      
      console.log("✅ Check-in successful:", response);
      console.log("📞 Phone number format stored:", response.phoneNumber);

      // Add new patient to the queue
      setWaitingPatients(prev => [newPatient, ...prev]);

      // Store phone to patient ID mapping for SMS reply processing
      setPhoneToPatientMap(prev => {
        const updated = {
          ...prev,
          [response.phoneNumber]: newPatient.id
        };
        console.log("🗺️ Updated phoneToPatientMap:", updated);
        return updated;
      });

      // Reset form and close dialog
      setFormData({
        patientName: "",
        phoneNumber: "",
        idNumber: "",
      });
      setIsDialogOpen(false);
      
      // Show success message with formatted phone number
      alert(`Access request sent to ${formData.patientName} at ${response.phoneNumber}. Patient added to queue.`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to send access request. Please check your backend server is running.";
      setErrorMessage(errorMsg);
      console.error("Check-in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-warning flex items-center justify-center">
                  <Users className="w-4 h-4 text-secondary-foreground" />
                </div>
                <span className="font-display font-bold">Admin Portal</span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="text-xs"
              >
                🗑️ Clear Data
              </Button>
              <span className="text-sm text-muted-foreground truncate">Soweto General Clinic</span>
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="heroSecondary" className="shrink-0">
                    <UserPlus className="w-4 h-4" />
                    New Check-In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>New Check-In Request</DialogTitle>
                    <DialogDescription>
                      Enter patient details to send an access request to their phone
                    </DialogDescription>
                  </DialogHeader>
                  {errorMessage && (
                    <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{errorMessage}</p>
                    </div>
                  )}
                  <form onSubmit={handleSubmitCheckIn} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="patientName" className="text-sm font-medium">
                        Patient Name
                      </label>
                      <Input
                        id="patientName"
                        name="patientName"
                        placeholder="Full name"
                        value={formData.patientName}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phoneNumber" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="+27 12 345 6789"
                        value={formData.phoneNumber}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="idNumber" className="text-sm font-medium">
                        ID Number (Optional)
                      </label>
                      <Input
                        id="idNumber"
                        name="idNumber"
                        placeholder="11-digit ID number"
                        value={formData.idNumber}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="heroSecondary"
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Request
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </motion.div>

            {/* Waiting Queue */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
                <h2 className="text-lg sm:text-xl font-display font-semibold">Patient Queue</h2>
                <span className="text-sm text-muted-foreground w-fit">
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
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
                      <div className="sm:text-right">
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
                              <span className="truncate">{doctor.name}</span>
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
                  <span className="text-2xl font-display font-bold">{waitingPatients.length + completedPatients.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="text-2xl font-display font-bold text-success">{completedPatients.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">In Queue</span>
                  <span className="text-2xl font-display font-bold text-warning">{waitingPatients.filter(p => p.status !== 'with_doctor').length}</span>
                </div>
              </div>
              
              {/* Completed Patients List */}
              {completedPatients.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium mb-3 text-success">Recently Completed</h4>
                  <div className="space-y-2">
                    {completedPatients.slice(-3).map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-2 rounded-lg bg-success/10">
                        <span className="text-sm font-medium">{patient.name}</span>
                        <span className="text-xs text-muted-foreground">{patient.completedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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