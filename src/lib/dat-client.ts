/**
 * Client-side DAT service that calls the server API
 * This avoids using Node.js-specific libraries in the browser
 */

export interface DATMintingProgress {
  step: number;
  message: string;
  fileId?: string;
  jobId?: string;
  url?: string;
}

export interface DATMintingResult {
  success: boolean;
  fileId: string;
  jobId: string;
  url: string;
  proofRequest?: any;
}

export class DATClient {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = 
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3001'
        : 'https://festify-ai-greetings.onrender.com';
  }

  /**
   * Mint DAT by calling the server API
   * Note: Will work on LazAI Mainnet once mainnet DAT functionality is available
   */
  async mintDAT(
    walletAddress: string,
    privacyData: string,
    fileName: string = 'privacy_data.txt',
    rewardAmount: number = 100,
    onProgress?: (progress: DATMintingProgress) => void
  ): Promise<DATMintingResult> {
    try {
      onProgress?.({
        step: 1,
        message: 'Preparing DAT minting request...'
      });

      const response = await fetch(`${this.apiBaseUrl}/api/mint-dat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress, // Server will handle private key derivation when mainnet DAT is live
          privacyData,
          fileName,
          rewardAmount
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mint DAT');
      }

      const result = await response.json();

      onProgress?.({
        step: 5,
        message: 'DAT minted successfully!',
        fileId: result.fileId,
        jobId: result.jobId,
        url: result.url
      });

      return result;
    } catch (error) {
      console.error('DAT minting error:', error);
      throw error;
    }
  }
}

