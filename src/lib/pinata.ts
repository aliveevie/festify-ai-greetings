interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface Metadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  external_url: string;
}

export class PinataService {
  private apiKey: string;
  private apiSecret: string;
  private gatewayUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_API_KEY;
    this.apiSecret = import.meta.env.VITE_API_SECRET;
    this.gatewayUrl = import.meta.env.VITE_GATEWAY_URL;
    
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Pinata API credentials not found in environment variables');
    }
  }

  // Upload image to Pinata
  async uploadImage(imageBlob: Blob, fileName: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', imageBlob, fileName);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.apiSecret,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      const data: PinataResponse = await response.json();
      return `${this.gatewayUrl}/ipfs/${data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading image to Pinata:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Upload metadata to Pinata
  async uploadMetadata(metadata: Metadata): Promise<string> {
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.apiSecret,
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error(`Pinata metadata upload failed: ${response.statusText}`);
      }

      const data: PinataResponse = await response.json();
      return `ipfs://${data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading metadata to Pinata:', error);
      throw new Error(`Failed to upload metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate the downloadable image and upload to Pinata
  async generateAndUploadGreetingImage(
    greetingData: any, 
    selectedDesign: string
  ): Promise<string> {
    try {
      // Create canvas and generate image (same as download function)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Set canvas dimensions
      canvas.width = 800;
      canvas.height = 600;

      // Get design colors based on selected design
      const designColors = this.getDesignColors(selectedDesign);
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      designColors.forEach((color, index) => {
        gradient.addColorStop(index / (designColors.length - 1), color);
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add title
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(greetingData?.title || 'Happy Festival!', canvas.width / 2, 150);

      // Add message
      ctx.font = '24px Arial';
      const message = greetingData?.message || 'Wishing you joy and happiness!';
      const words = message.split(' ');
      let line = '';
      let y = 250;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > 600 && n > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[n] + ' ';
          y += 40;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);

      // Add footer
      ctx.font = '18px Arial';
      ctx.fillText('Created with Festify', canvas.width / 2, canvas.height - 50);

      // Convert canvas to blob and upload
      return new Promise((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const fileName = `festify-greeting-${Date.now()}.png`;
              const imageUrl = await this.uploadImage(blob, fileName);
              resolve(imageUrl);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error('Failed to generate image blob'));
          }
        }, 'image/png');
      });
    } catch (error) {
      console.error('Error generating and uploading image:', error);
      throw error;
    }
  }

  // Create and upload complete metadata
  async createAndUploadMetadata(
    greetingData: any,
    selectedDesign: string,
    imageUrl: string
  ): Promise<string> {
    try {
      const metadata: Metadata = {
        name: greetingData?.title || 'Festify Greeting',
        description: greetingData?.message || 'A beautiful AI-powered festival greeting created with Festify',
        image: imageUrl,
        attributes: [
          {
            trait_type: 'Design Theme',
            value: selectedDesign
          },
          {
            trait_type: 'Creator',
            value: 'Festify AI'
          },
          {
            trait_type: 'Type',
            value: 'Festival Greeting'
          }
        ],
        external_url: 'https://festify-ai.vercel.app/'
      };

      return await this.uploadMetadata(metadata);
    } catch (error) {
      console.error('Error creating and uploading metadata:', error);
      throw error;
    }
  }

  // Get design colors based on selected design
  private getDesignColors(selectedDesign: string): string[] {
    const designColors: { [key: string]: string[] } = {
      "festive-gold": ["#FCD34D", "#F97316", "#DC2626"],
      "cosmic-purple": ["#8B5CF6", "#EC4899", "#4F46E5"],
      "nature-green": ["#4ADE80", "#10B981", "#0D9488"],
      "sunset-orange": ["#FB923C", "#DC2626", "#EC4899"],
      "ocean-blue": ["#60A5FA", "#06B6D4", "#0D9488"],
      "romantic-pink": ["#F472B6", "#F43F5E", "#F87171"],
      "spring-floral": ["#F9A8D4", "#A855F7", "#6366F1"],
      "midnight-dark": ["#374151", "#475569", "#312E81"],
      "electric-blue": ["#3B82F6", "#06B6D4", "#2563EB"],
      "royal-purple": ["#7C3AED", "#8B5CF6", "#6D28D9"],
      "crystal-clear": ["#67E8F9", "#BFDBFE", "#A5B4FC"],
      "rainbow-dream": ["#F87171", "#FCD34D", "#4ADE80", "#60A5FA", "#A855F7"],
      "cloudy-sky": ["#CBD5E1", "#E2E8F0", "#DBEAFE"],
      "winter-frost": ["#DBEAFE", "#E0F2FE", "#FFFFFF"],
      "gift-wrapped": ["#EF4444", "#F472B6", "#F43F5E"],
      "target-focus": ["#F97316", "#DC2626", "#EC4899"],
      "shield-protection": ["#10B981", "#14B8A6", "#06B6D4"],
      "music-harmony": ["#6366F1", "#A855F7", "#EC4899"],
      "golden-hour": ["#F59E0B", "#FB923C", "#FCD34D"]
    };

    return designColors[selectedDesign] || designColors["festive-gold"];
  }
}

// Export singleton instance
export const pinataService = new PinataService(); 