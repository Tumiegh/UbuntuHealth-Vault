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
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import ConnectButton from "@/components/ConnectButton";
import { ViewRecords } from "@/components/ViewRecords";
import { useState, useEffect } from "react";
import { HEALTH_VAULT_ADDRESS, HEALTH_VAULT_ABI } from "@/config/contract";
import { useToast } from "@/hooks/use-toast";

// Mock data for demo purposes
const mockConsentRequests = [
  {
    requestId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    requester: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    timestamp: Date.now() - 2 * 60 * 1000, // 2 minutes ago
    isPending: true,
    isGranted: false,
    expiryTime: 0,
    institution: "Soweto General Clinic",
    doctorName: "Dr. Thandiwe Mbeki"
  },
  {
    requestId: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    requester: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    timestamp: Date.now() - 60 * 60 * 1000, // 1 hour ago
    isPending: true,
    isGranted: false,
    expiryTime: 0,
    institution: "Dr. Nkosi's Practice",
    doctorName: "Dr. John Nkosi"
  },
  {
    requestId: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    requester: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    timestamp: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
    isPending: true,
    isGranted: false,
    expiryTime: 0,
    institution: "Alexandra Community Hospital",
    doctorName: "Dr. Sarah Mokoena"
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

interface AccessRequest {
  requestId: string;
  requester: string;
  timestamp: number;
  isPending: boolean;
  isGranted: boolean;
  expiryTime: number;
  institution?: string;
  doctorName?: string;
}

const PatientDashboard = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  // Use mock data for demo - can be replaced with real blockchain data
  const [consentRequests, setConsentRequests] = useState<AccessRequest[]>(mockConsentRequests);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedExpiry, setSelectedExpiry] = useState<{ [key: string]: string }>({});
  const [useMockData] = useState(true); // Toggle this to use real blockchain data

  // Fetch pending access requests from blockchain (optional - for production)
  const { data: requestIds, refetch: refetchRequests } = useReadContract({
    address: HEALTH_VAULT_ADDRESS as `0x${string}`,
    abi: HEALTH_VAULT_ABI,
    functionName: 'getPendingRequests',
    args: address && !useMockData ? [address] : undefined,
  });

  // Grant access transaction
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Refetch requests when transaction succeeds (only if using real blockchain data)
  useEffect(() => {
    if (isSuccess && !useMockData) {
      toast({
        title: "Success",
        description: "Access request processed successfully",
      });
      refetchRequests();
    }
  }, [isSuccess, refetchRequests, toast, useMockData]);

  // Fetch request details when requestIds change (only if using real blockchain data)
  useEffect(() => {
    if (useMockData) return; // Skip if using mock data

    const fetchRequestDetails = async () => {
      if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
        setConsentRequests([]);
        return;
      }

      try {
        const requests: AccessRequest[] = (requestIds as string[]).map((id) => ({
          requestId: id,
          requester: `0x${id.slice(2, 42)}`,
          timestamp: Date.now(),
          isPending: true,
          isGranted: false,
          expiryTime: 0,
        }));
        setConsentRequests(requests);
      } catch (error) {
        console.error("Error fetching request details:", error);
      }
    };

    fetchRequestDetails();
  }, [requestIds, useMockData]);

  const handleConsentResponse = (requestId: string, approved: boolean) => {
    const request = consentRequests.find(req => req.requestId === requestId);
    const institutionName = request?.institution || "Healthcare Provider";

    if (!approved) {
      // Remove from UI
      setConsentRequests(prev => prev.filter(req => req.requestId !== requestId));
      toast({
        title: "Request Denied",
        description: `Access request from ${institutionName} has been denied`,
      });
      return;
    }

    if (useMockData) {
      // Demo mode - just update UI
      const expiry = selectedExpiry[requestId] || "24h";
      setConsentRequests(prev => prev.filter(req => req.requestId !== requestId));
      toast({
        title: "Access Granted",
        description: `${institutionName} can now access your records for ${expiry}`,
      });
    } else {
      // Production mode - interact with blockchain
      const expiry = selectedExpiry[requestId] || "24h";
      const expiryTimestamp = getExpiryTimestamp(expiry);

      writeContract({
        address: HEALTH_VAULT_ADDRESS as `0x${string}`,
        abi: HEALTH_VAULT_ABI,
        functionName: 'grantAccess',
        args: [requestId as `0x${string}`, BigInt(expiryTimestamp)],
      });
    }
  };

  const getExpiryTimestamp = (expiry: string): number => {
    const now = Math.floor(Date.now() / 1000);
    switch (expiry) {
      case "24h":
        return now + 24 * 60 * 60;
      case "7d":
        return now + 7 * 24 * 60 * 60;
      case "30d":
        return now + 30 * 24 * 60 * 60;
      case "permanent":
        return now + 100 * 365 * 24 * 60 * 60; // 100 years
      default:
        return now + 24 * 60 * 60;
    }
  };

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-3">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Please connect your wallet to access the patient portal and manage your medical records securely.
          </p>
          <ConnectButton />
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Your wallet address is your secure identity on the blockchain. All your medical data is encrypted and only accessible with your permission.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold">Patient Portal</span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {consentRequests.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
              </Button>
              <ConnectButton />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">Thabo Molefe</div>
                  <div className="text-xs text-muted-foreground">{address?.slice(0, 6)}...{address?.slice(-4)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="fixed top-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-border rounded-xl shadow-xl p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Notifications</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                Close
              </Button>
            </div>
            {consentRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No new notifications
              </p>
            ) : (
              <div className="space-y-2">
                {consentRequests.map((request) => (
                  <div
                    key={request.requestId}
                    className="p-3 bg-muted rounded-lg"
                  >
                    <p className="text-sm font-medium">
                      {request.institution || "Access Request"}
                    </p>
                    {request.doctorName && (
                      <p className="text-xs text-muted-foreground">
                        {request.doctorName}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.timestamp).toRelativeTimeString?.() ||
                       new Date(request.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

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
                    key={request.requestId}
                    className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-5 h-5 text-warning" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">
                            {request.institution || "Access Request"}
                          </h3>
                          {request.doctorName && (
                            <p className="text-sm text-muted-foreground">
                              {request.doctorName}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {request.requester.slice(0, 6)}...{request.requester.slice(-4)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(request.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Expiry Selection */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Grant access for:</label>
                        <select
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                          value={selectedExpiry[request.requestId] || "24h"}
                          onChange={(e) => setSelectedExpiry(prev => ({ ...prev, [request.requestId]: e.target.value }))}
                        >
                          <option value="24h">24 hours</option>
                          <option value="7d">7 days</option>
                          <option value="30d">30 days</option>
                          <option value="permanent">Permanent</option>
                        </select>
                      </div>

                      <div className="flex w-full gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleConsentResponse(request.requestId, false)}
                          disabled={isPending || isConfirming}
                        >
                          Deny
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleConsentResponse(request.requestId, true)}
                          disabled={isPending || isConfirming}
                        >
                          {isPending || isConfirming ? "Processing..." : "Approve"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Medical Records */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <ViewRecords />
            </motion.section>

            {/* Health Timeline */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
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
              className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 sm:p-6 border border-primary/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-display font-semibold">Your Data Vault</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Fully encrypted & sovereign</p>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Records Stored</span>
                  <span className="font-medium">47 documents</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Active Consents</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">Today, 09:15</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Access */}
            <motion.div
              className="bg-card rounded-2xl p-4 sm:p-6 border border-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="text-base sm:text-lg font-display font-semibold mb-4">Recent Access</h3>
              <div className="space-y-3 sm:space-y-4">
                {accessHistory.map((access) => (
                  <div key={access.id} className="flex items-start gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium truncate">{access.institution}</p>
                      <p className="text-xs text-muted-foreground">{access.doctor}</p>
                      <div className="flex items-center gap-1 sm:gap-2 mt-1">
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
