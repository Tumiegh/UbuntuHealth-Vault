import express from 'express';
import multer from 'multer';
import { uploadToIPFS, retrieveFromIPFS } from '../config/ipfs.js';
import { encryptFile, decryptFile } from '../utils/encryption.js';
import { getContract } from '../config/blockchain.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * Upload a medical record
 * POST /api/records/upload
 * Body: file (multipart/form-data), patientAddress
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { patientAddress } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!patientAddress) {
      return res.status(400).json({ error: 'Patient address required' });
    }

    console.log(`Uploading file for patient: ${patientAddress}`);
    console.log(`File name: ${file.originalname}, Size: ${file.size} bytes`);

    // Encrypt the file
    const encryptedFile = encryptFile(file.buffer);
    console.log('File encrypted successfully');

    // Upload to IPFS
    const ipfsHash = await uploadToIPFS(encryptedFile, file.originalname);
    console.log(`File uploaded to IPFS: ${ipfsHash}`);

    // Return the hash for the frontend to submit to blockchain
    res.json({
      success: true,
      ipfsHash,
      fileName: file.originalname,
      fileSize: file.size,
      message: 'File encrypted and uploaded to IPFS. Please confirm transaction in your wallet to add to blockchain.'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload file', 
      details: error.message 
    });
  }
});

/**
 * Download and decrypt a medical record
 * GET /api/records/download/:ipfsHash
 * Query: requesterAddress, patientAddress
 */
router.get('/download/:ipfsHash', async (req, res) => {
  try {
    const { ipfsHash } = req.params;
    const { requesterAddress, patientAddress } = req.query;

    if (!requesterAddress || !patientAddress) {
      return res.status(400).json({ 
        error: 'Requester and patient addresses required' 
      });
    }

    console.log(`Download request - IPFS: ${ipfsHash}, Requester: ${requesterAddress}, Patient: ${patientAddress}`);

    // Check blockchain access rights
    const isPatient = requesterAddress.toLowerCase() === patientAddress.toLowerCase();

    if (!isPatient) {
      // Check blockchain for access permission
      console.log('Access check: Requester is not the patient, checking blockchain permissions...');
      try {
        const contract = getContract();
        const hasAccess = await contract.hasAccess(patientAddress, requesterAddress);
        if (!hasAccess) {
          return res.status(403).json({ error: 'Access denied - no blockchain permission' });
        }
        console.log('Access granted via blockchain');
      } catch (error) {
        console.error('Blockchain access check failed:', error);
        return res.status(403).json({ error: 'Access denied - blockchain check failed' });
      }
    }

    // Retrieve from IPFS
    console.log('Retrieving file from IPFS...');
    const encryptedFile = await retrieveFromIPFS(ipfsHash);
    console.log('File retrieved from IPFS');

    // Decrypt file
    console.log('Decrypting file...');
    const decryptedFile = decryptFile(encryptedFile);
    console.log('File decrypted successfully');

    // Send file
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="medical-record-${ipfsHash.substring(0, 8)}.pdf"`
    });
    res.send(decryptedFile);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'Failed to download file', 
      details: error.message 
    });
  }
});

/**
 * Get patient's medical records from blockchain
 * GET /api/records/patient/:patientAddress
 */
router.get('/patient/:patientAddress', async (req, res) => {
  try {
    const { patientAddress } = req.params;
    const contract = getContract();

    console.log(`Fetching records for patient: ${patientAddress}`);

    // Get records from blockchain
    const records = await contract.getPatientRecords(patientAddress);

    // Format records
    const formattedRecords = records.map((record, index) => ({
      index,
      ipfsHash: record.ipfsHash,
      timestamp: Number(record.timestamp),
      isActive: record.isActive,
      date: new Date(Number(record.timestamp) * 1000).toISOString()
    }));

    res.json({
      success: true,
      records: formattedRecords.filter(r => r.isActive)
    });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({
      error: 'Failed to get records from blockchain',
      details: error.message
    });
  }
});

/**
 * Get file metadata from IPFS hash
 * GET /api/records/metadata/:ipfsHash
 */
router.get('/metadata/:ipfsHash', async (req, res) => {
  try {
    const { ipfsHash } = req.params;

    res.json({
      success: true,
      ipfsHash,
      gateway: `https://w3s.link/ipfs/${ipfsHash}`,
      message: 'File is stored on IPFS and encrypted'
    });
  } catch (error) {
    console.error('Metadata error:', error);
    res.status(500).json({
      error: 'Failed to get metadata',
      details: error.message
    });
  }
});

export default router;

