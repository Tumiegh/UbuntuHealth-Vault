import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, Loader2, AlertCircle, Calendar, ExternalLink } from "lucide-react";
import { useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";

interface MedicalRecord {
  index: number;
  ipfsHash: string;
  timestamp: number;
  isActive: boolean;
  date: string;
}

export function ViewRecords() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      fetchRecords();
    }
  }, [isConnected, address]);

  const fetchRecords = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/records/patient/${address}`);
      const data = await response.json();

      if (data.success) {
        setRecords(data.records);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch records",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (ipfsHash: string) => {
    if (!address) return;

    setDownloading(ipfsHash);
    try {
      const response = await fetch(
        `http://localhost:3000/api/records/download/${ipfsHash}?requesterAddress=${address}&patientAddress=${address}`
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medical-record-${ipfsHash.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Record downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading record:", error);
      toast({
        title: "Error",
        description: "Failed to download record",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  if (!isConnected) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
        <p className="text-muted-foreground">Please connect your wallet to view your medical records</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your medical records...</p>
      </Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
        <p className="text-muted-foreground">You don't have any medical records yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Your Medical Records</h2>
        <Button onClick={fetchRecords} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {records.map((record) => (
          <motion.div
            key={record.index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Medical Record #{record.index + 1}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(record.timestamp * 1000).toLocaleDateString('en-ZA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono bg-muted p-2 rounded">
                    <span className="text-muted-foreground">IPFS:</span>
                    <span className="truncate">{record.ipfsHash}</span>
                    <a
                      href={`https://w3s.link/ipfs/${record.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto"
                    >
                      <ExternalLink className="w-4 h-4 text-primary hover:text-primary/80" />
                    </a>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(record.ipfsHash)}
                  disabled={downloading === record.ipfsHash}
                  size="sm"
                >
                  {downloading === record.ipfsHash ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

