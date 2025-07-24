export interface UserGreeting {
  id: string;
  title: string;
  message: string;
  recipient: string;
  recipientName?: string;
  date: string;
  type: string;
  status: 'sent' | 'pending' | 'failed';
  txHash?: string;
  metadataURI?: string;
  imageUrl?: string;
  selectedDesign: string;
  userAddress: string;
  greetingData: any;
}

class StorageService {
  private readonly STORAGE_KEY = 'festify_user_greetings';

  saveGreeting(greeting: UserGreeting): void {
    try {
      const existingGreetings = this.getAllGreetings();
      const updatedGreetings = [...existingGreetings, greeting];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedGreetings));
    } catch (error) {
      console.error('Error saving greeting:', error);
    }
  }

  getAllGreetings(): UserGreeting[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting greetings:', error);
      return [];
    }
  }

  getUserGreetings(userAddress: string): UserGreeting[] {
    try {
      const allGreetings = this.getAllGreetings();
      return allGreetings.filter(greeting => 
        greeting.userAddress.toLowerCase() === userAddress.toLowerCase()
      );
    } catch (error) {
      console.error('Error getting user greetings:', error);
      return [];
    }
  }

  updateGreetingStatus(id: string, status: UserGreeting['status'], txHash?: string): void {
    try {
      const allGreetings = this.getAllGreetings();
      const updatedGreetings = allGreetings.map(greeting => 
        greeting.id === id 
          ? { ...greeting, status, ...(txHash && { txHash }) }
          : greeting
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedGreetings));
    } catch (error) {
      console.error('Error updating greeting status:', error);
    }
  }

  deleteGreeting(id: string): void {
    try {
      const allGreetings = this.getAllGreetings();
      const updatedGreetings = allGreetings.filter(greeting => greeting.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedGreetings));
    } catch (error) {
      console.error('Error deleting greeting:', error);
    }
  }

  clearAllGreetings(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing greetings:', error);
    }
  }
}

export const storageService = new StorageService(); 