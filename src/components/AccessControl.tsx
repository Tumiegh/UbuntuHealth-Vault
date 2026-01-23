import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, UserCheck, UserX, Loader2, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { HEALTH_VAULT_ADDRESS, HEALTH_VAULT_ABI } from "@/config/contract";

interface AccessRequest {
  requestId: string;
  requester: string;
  timestamp: number;
  isPending: boolean;
  isGranted: boolean;
  expiryTime: number;
}

interface GrantedAccess {
  doctor: string;
  expiryTime: number;
}

export function AccessControl() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
  const [grantedAccesses, setGrantedAccesses] = useState<GrantedAccess[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Read pending requests from blockchain
  const { data: requestIds, refetch: refetchRequests } = useReadContract({
    address: HEALTH_VAULT_ADDRESS as `0x${string}`,
    abi: HEALTH_VAULT_ABI,
    functionName: 'getPendingRequests',
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: "Transaction confirmed successfully",
      });
      refetchRequests();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (requestIds && Array.isArray(requestIds)) {
      fetchRequestDetails(requestIds as string[]);
    }
  }, [requestIds]);

  const fetchRequestDetails = async (ids: string[]) => {
    setLoading(true);
    try {
      // In a real implementation, you would fetch details for each request ID
      // For now, we'll use mock data
      const requests: AccessRequest[] = ids.map((id, index) => ({
        requestId: id,
        requester: `0x${Math.random().toString(16).slice(2, 42)}`,
        timestamp: Date.now() - index * 3600000,
        isPending: true,
        isGranted: false,
        expiryTime: 0,
      }));
      setPendingRequests(requests);
    } catch (error) {
      console.error("Error fetching request details:", error);
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

    writeContract({
      address: HEALTH_VAULT_ADDRESS as `0x${string}`,
      abi: HEALTH_VAULT_ABI,
      functionName: 'grantAccess',
      args: [requestId as `0x${string}`, BigInt(expiryTimestamp)],
    });
  };

  const handleRevokeAccess = (doctorAddress: string) => {
    writeContract({
      address: HEALTH_VAULT_ADDRESS as `0x${string}`,
      abi: HEALTH_VAULT_ABI,
      functionName: 'revokeAccess',
      args: [doctorAddress as `0x${string}`],
    });
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
                        <h3 className="font-semibold">Access Request</h3>
                      </div>

                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium">From:</span>{" "}
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
                        <h3 className="font-semibold">Active Access</h3>
                      </div>

                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium">Doctor:</span>{" "}
                          <span className="font-mono">{access.doctor.slice(0, 6)}...{access.doctor.slice(-4)}</span>
                        </p>
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

