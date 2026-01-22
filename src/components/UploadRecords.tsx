import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HEALTH_VAULT_ADDRESS, HEALTH_VAULT_ABI } from '@/config/contract';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function UploadRecords() {
  const { address, isConnected } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  // Add record to blockchain
  const { writeContract: addRecord, data: addHash } = useWriteContract();
  
  const { isLoading: isAdding, isSuccess: addSuccess } = useWaitForTransactionReceipt({
    hash: addHash,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIpfsHash(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    setUploading(true);

    try {
      // Upload to backend (which encrypts and stores on IPFS)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientAddress', address);

      toast.info('Encrypting and uploading to IPFS...');

      const response = await axios.post(`${API_URL}/api/records/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const hash = response.data.ipfsHash;
      setIpfsHash(hash);
      
      toast.success('File uploaded to IPFS! Now adding to blockchain...');

      // Add record to blockchain
      addRecord({
        address: HEALTH_VAULT_ADDRESS,
        abi: HEALTH_VAULT_ABI,
        functionName: 'addRecord',
        args: [hash]
      });

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to upload file');
      setUploading(false);
    }
  };

  if (addSuccess) {
    setTimeout(() => {
      setFile(null);
      setIpfsHash(null);
      setUploading(false);
      toast.success('Medical record added successfully!');
    }, 2000);
  }

  if (!isConnected) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-card rounded-2xl p-8 border border-border text-center">
          <AlertCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to upload medical records</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-card rounded-2xl p-8 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">Upload Medical Record</h2>
            <p className="text-sm text-muted-foreground">Encrypted and stored on IPFS</p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={uploading || isAdding}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                      setIpfsHash(null);
                    }}
                    className="ml-4 text-sm text-destructive hover:underline"
                    disabled={uploading || isAdding}
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Upload Status */}
          {ipfsHash && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-success">File uploaded to IPFS</p>
                  <p className="text-sm text-muted-foreground mt-1 break-all">
                    Hash: {ipfsHash}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!file || uploading || isAdding}
          >
            {uploading || isAdding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isAdding ? 'Adding to Blockchain...' : 'Uploading to IPFS...'}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Medical Record
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

