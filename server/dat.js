const { Client } = require('alith/lazai');
const { PinataIPFS } = require('alith/data/storage');
const { encrypt } = require('alith/data');
const NodeRSA = require('node-rsa');
const axios = require('axios');

/**
 * DAT Service for server-side Data Anchor Token operations
 */
class DATService {
  constructor(privateKey, ipfsJwt) {
    if (!privateKey) {
      throw new Error('PRIVATE_KEY is required for DAT service');
    }
    
    this.privateKey = privateKey;
    this.ipfsJwt = ipfsJwt;
    this.client = new Client(undefined, undefined, privateKey);
    this.ipfs = new PinataIPFS();
    this.fileUrlMap = new Map();
  }

  /**
   * Encrypt privacy data using wallet signature
   */
  async encryptData(data) {
    const encryptionSeed = 'Sign to retrieve your encryption key';
    const wallet = this.client.getWallet();
    const password = wallet.sign(encryptionSeed).signature;
    const dataBytes = Uint8Array.from(Buffer.from(data, 'utf-8'));
    const encryptedData = await encrypt(dataBytes, password);
    return { encryptedData, password, encryptionSeed };
  }

  /**
   * Upload encrypted data to IPFS
   */
  async uploadToIPFS(encryptedData, fileName) {
    try {
      const fileMeta = await this.ipfs.upload({
        name: fileName,
        data: Buffer.from(encryptedData),
        token: this.ipfsJwt || '',
      });

      const url = await this.ipfs.getShareLink({
        token: this.ipfsJwt || '',
        id: fileMeta.id
      });

      return url;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error(`Failed to upload to IPFS: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Register file with LazAI and get file ID
   */
  async registerFile(url) {
    try {
      let fileId = await this.client.getFileIdByUrl(url);
      
      if (fileId === BigInt(0)) {
        fileId = await this.client.addFile(url);
      }

      // Store URL for later retrieval
      this.fileUrlMap.set(fileId.toString(), url);

      return fileId;
    } catch (error) {
      console.error('File registration error:', error);
      throw new Error(`Failed to register file: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Request proof from verified computing node
   */
  async requestProof(fileId, rewardAmount, password, encryptionSeed, fileUrl) {
    try {
      await this.client.requestProof(fileId, rewardAmount);
      const jobIds = await this.client.fileJobIds(fileId);
      const jobId = jobIds[jobIds.length - 1];
      const job = await this.client.getJob(jobId);
      const nodeInfo = await this.client.getNode(job.nodeAddress);
      const nodeUrl = nodeInfo.url;
      const pubKey = nodeInfo.publicKey;

      const rsa = new NodeRSA(pubKey, 'pkcs1-public-pem');
      const encryptedKey = rsa.encrypt(password, 'hex');

      const proofRequest = {
        job_id: Number(jobId),
        file_id: Number(fileId),
        file_url: fileUrl,
        encryption_key: encryptedKey,
        encryption_seed: encryptionSeed,
        nonce: null,
        proof_url: null,
      };

      // Send proof request to node
      try {
        const response = await axios.post(`${nodeUrl}/proof`, proofRequest, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
          console.log('✅ Proof request sent successfully');
        } else {
          console.warn('⚠️ Proof request returned status:', response.status);
        }
      } catch (error) {
        console.warn('⚠️ Proof request error (may be processed asynchronously):', error.message);
        // Continue even if proof request fails - it might be processed asynchronously
      }

      return { jobId, proofRequest };
    } catch (error) {
      console.error('Request proof error:', error);
      throw new Error(`Failed to request proof: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Request DAT reward
   */
  async requestReward(fileId) {
    try {
      await this.client.requestReward(fileId);
      console.log('✅ Reward requested for file id', fileId.toString());
    } catch (error) {
      console.error('Request reward error:', error);
      throw new Error(`Failed to request reward: ${error?.message || 'Unknown error'}`);
    }
  }
}

/**
 * Complete DAT minting flow
 * This is the main function called by the API endpoint
 */
async function mintDAT(privateKey, ipfsJwt, privacyData, fileName = 'privacy_data.txt', rewardAmount = 100) {
  try {
    const service = new DATService(privateKey, ipfsJwt);
    
    // Step 1: Encrypt data
    console.log('[DAT] Step 1: Encrypting data...');
    const { encryptedData, password, encryptionSeed } = await service.encryptData(privacyData);
    
    // Step 2: Upload to IPFS
    console.log('[DAT] Step 2: Uploading to IPFS...');
    const url = await service.uploadToIPFS(encryptedData, fileName);
    
    // Step 3: Register file
    console.log('[DAT] Step 3: Registering file with LazAI...');
    const fileId = await service.registerFile(url);
    
    // Step 4: Request proof
    console.log('[DAT] Step 4: Requesting proof...');
    const rewardAmountBigInt = BigInt(rewardAmount);
    const { jobId, proofRequest } = await service.requestProof(
      fileId,
      rewardAmountBigInt,
      password,
      encryptionSeed,
      url
    );
    
    // Step 5: Request reward
    console.log('[DAT] Step 5: Requesting reward...');
    await service.requestReward(fileId);
    
    return {
      success: true,
      fileId: fileId.toString(),
      jobId: jobId.toString(),
      url,
      proofRequest
    };
  } catch (error) {
    console.error('[DAT] Error in minting flow:', error);
    throw error;
  }
}

module.exports = { DATService, mintDAT };

