import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, UserCheck, UserX, Loader2, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { readContract } from "wagmi/actions";
import { useToast } from "@/hooks/use-toast";
import { HEALTH_VAULT_ADDRESS, HEALTH_VAULT_ABI } from "@/config/contract";
import { config } from "@/config/wagmi";

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

interface GrantedAccess {
  doctor: string;
  expiryTime: number;
  institution?: string;
  doctorName?: string;
  grantedAt: number;
}

// Mock data for demo purposes
const mockPendingRequests: AccessRequest[] = [
  {
    requestId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    requester: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    timestamp: Date.now() - 2 * 60 * 1000,
    isPending: true,
    isGranted: false,
    expiryTime: 0,
    institution: "Soweto General Clinic",
    doctorName: "Dr. Thandiwe Mbeki"
  },
  {
    requestId: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    requester: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    timestamp: Date.now() - 60 * 60 * 1000,
    isPending: true,
    isGranted: false,
    expiryTime: 0,
    institution: "Dr. Nkosi's Practice",
    doctorName: "Dr. John Nkosi"
  }
];

const mockGrantedAccesses: GrantedAccess[] = [
  {
    doctor: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    expiryTime: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
    institution: "Alexandra Community Hospital",
    doctorName: "Dr. Sarah Mokoena",
    grantedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 // 2 days ago
  },
  {
    doctor: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
    expiryTime: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
    institution: "Sandton Medical Centre",
    doctorName: "Dr. Michael Chen",
    grantedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 // 5 days ago
  }
];

export function AccessControl() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  // Use mock data for demo - can be replaced with real blockchain data
  const [useMockData] = useState(true); // Toggle this to use real blockchain data
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>(mockPendingRequests);
  const [grantedAccesses, setGrantedAccesses] = useState<GrantedAccess[]>(mockGrantedAccesses);
  const [selectedExpiry, setSelectedExpiry] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Read pending requests from blockchain (optional - for production)
  const { data: requestIds, refetch: refetchRequests } = useReadContract({
    address: HEALTH_VAULT_ADDRESS as `0x${string}`,
    abi: HEALTH_VAULT_ABI,
    functionName: 'getPendingRequests',
    args: address && !useMockData ? [address] : undefined,
  });

  useEffect(() => {
    if (isSuccess && !useMockData) {
      toast({
        title: "Success",
        description: "Transaction confirmed successfully",
      });
      refetchRequests();
    }
  }, [isSuccess, useMockData]);

  useEffect(() => {
    if (useMockData) return; // Skip if using mock data

    if (requestIds && Array.isArray(requestIds)) {
      fetchRequestDetails(requestIds as string[]);
    }
  }, [requestIds, useMockData]);

  const fetchRequestDetails = async (ids: string[]) => {
    if (!ids || ids.length === 0) {
      setPendingRequests([]);
      return;
    }

    setLoading(true);
    try {
      // Fetch details for each request ID from the blockchain
      const requestPromises = ids.map(async (id) => {
        try {
          const result = await readContract(config, {
            address: HEALTH_VAULT_ADDRESS as `0x${string}`,
            abi: HEALTH_VAULT_ABI,
            functionName: 'getAccessRequest',
            args: [id as `0x${string}`],
          });

          // The result is a tuple: [requester, timestamp, isPending, isGranted, expiryTime]
          const [requester, timestamp, isPending, isGranted, expiryTime] = result as [string, bigint, boolean, boolean, bigint];

          return {
            requestId: id,
            requester,
            timestamp: Number(timestamp) * 1000, // Convert to milliseconds
            isPending,
            isGranted,
            expiryTime: Number(expiryTime),
          };
        } catch (error) {
          console.error(`Error fetching request ${id}:`, error);
          return null;
        }
      });

      const requests = (await Promise.all(requestPromises)).filter(
        (req): req is AccessRequest => req !== null && req.isPending
      );

      setPendingRequests(requests);
    } catch (error) {
      console.error("Error fetching request details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch access requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getExpiryTimestamp = (duration: string): number => {
    const now = Math.floor(Date.now() / 1000);
    switch (duration) {
      case "24h":
        return now + 86400; // 24 hours
      case "7d":
        return now + 604800; // 7 days
      case "30d":
        return now + 2592000; // 30 days
      case "permanent":
        return 0; // No expiry
      default:
        return now + 86400;
    }
  };

  const handleGrantAccess = (requestId: string) => {
    const expiry = selectedExpiry[requestId] || "24h";
    const expiryTimestamp = getExpiryTimestamp(expiry);
    const request = pendingRequests.find(req => req.requestId === requestId);

    if (useMockData) {
      // Demo mode - update UI
      setPendingRequests(prev => prev.filter(req => req.requestId !== requestId));

      if (request) {
        const newAccess: GrantedAccess = {
          doctor: request.requester,
          expiryTime: expiryTimestamp,
          institution: request.institution,
          doctorName: request.doctorName,
          grantedAt: Date.now()
        };
        setGrantedAccesses(prev => [newAccess, ...prev]);
      }

      toast({
        title: "Access Granted",
        description: `${request?.institution || "Healthcare provider"} can now access your records`,
      });
    } else {
      // Production mode - interact with blockchain
      writeContract({
        address: HEALTH_VAULT_ADDRESS as `0x${string}`,
        abi: HEALTH_VAULT_ABI,
        functionName: 'grantAccess',
        args: [requestId as `0x${string}`, BigInt(expiryTimestamp)],
      });
    }
  };

  const handleRevokeAccess = (doctorAddress: string) => {
    const access = grantedAccesses.find(acc => acc.doctor === doctorAddress);

    if (useMockData) {
      // Demo mode - update UI
      setGrantedAccesses(prev => prev.filter(acc => acc.doctor !== doctorAddress));
      toast({
        title: "Access Revoked",
        description: `${access?.institution || "Healthcare provider"}'s access has been revoked`,
      });
    } else {
      // Production mode - interact with blockchain
      writeContract({
        address: HEALTH_VAULT_ADDRESS as `0x${string}`,
        abi: HEALTH_VAULT_ABI,
        functionName: 'revokeAccess',
        args: [doctorAddress as `0x${string}`],
      });
    }
  };

  if (!isConnected) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
        <p className="text-muted-foreground">Please connect your wallet to manage access control</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading access requests...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Access Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold">Pending Access Requests</h2>
          <Button onClick={() => refetchRequests()} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {pendingRequests.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
            <p className="text-muted-foreground">You don't have any pending access requests</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <motion.div
                key={request.requestId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <UserCheck className="w-5 h-5 text-warning" />
                        <h3 className="font-semibold">
                          {request.institution || "Access Request"}
                        </h3>
                      </div>

                      <div className="space-y-1 text-sm">
                        {request.doctorName && (
                          <p className="text-muted-foreground">
                            <span className="font-medium">Doctor:</span> {request.doctorName}
                          </p>
                        )}
                        <p className="text-muted-foreground">
                          <span className="font-medium">Address:</span>{" "}
                          <span className="font-mono">{request.requester.slice(0, 6)}...{request.requester.slice(-4)}</span>
                        </p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(request.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Select
                        value={selectedExpiry[request.requestId] || "24h"}
                        onValueChange={(value) =>
                          setSelectedExpiry(prev => ({ ...prev, [request.requestId]: value }))
                        }
                      >
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24 Hours</SelectItem>
                          <SelectItem value="7d">7 Days</SelectItem>
                          <SelectItem value="30d">30 Days</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        onClick={() => handleGrantAccess(request.requestId)}
                        disabled={isPending || isConfirming}
                        size="sm"
                        className="bg-success hover:bg-success/90"
                      >
                        {isPending || isConfirming ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Granting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Grant Access
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Granted Accesses */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-4">Active Access Grants</h2>

        {grantedAccesses.length === 0 ? (
          <Card className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Active Grants</h3>
            <p className="text-muted-foreground">You haven't granted access to anyone yet</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {grantedAccesses.map((access, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-success" />
                        <h3 className="font-semibold">
                          {access.institution || "Active Access"}
                        </h3>
                      </div>

                      <div className="space-y-1 text-sm">
                        {access.doctorName && (
                          <p className="text-muted-foreground">
                            <span className="font-medium">Doctor:</span> {access.doctorName}
                          </p>
                        )}
                        <p className="text-muted-foreground">
                          <span className="font-medium">Address:</span>{" "}
                          <span className="font-mono">{access.doctor.slice(0, 6)}...{access.doctor.slice(-4)}</span>
                        </p>
                        {access.grantedAt && (
                          <p className="text-muted-foreground">
                            <span className="font-medium">Granted:</span>{" "}
                            {new Date(access.grantedAt).toLocaleDateString()}
                          </p>
                        )}
                        <p className="text-muted-foreground">
                          <span className="font-medium">Expires:</span>{" "}
                          {access.expiryTime === 0
                            ? "Never"
                            : new Date(access.expiryTime * 1000).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleRevokeAccess(access.doctor)}
                      disabled={isPending || isConfirming}
                      variant="destructive"
                      size="sm"
                    >
                      {isPending || isConfirming ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Revoking...
                        </>
                      ) : (
                        <>
                          <UserX className="w-4 h-4" />
                          Revoke
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

