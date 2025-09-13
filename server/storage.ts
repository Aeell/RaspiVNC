// VNC connections don't require persistent storage
// Simple storage interface for any future needs

export interface IStorage {
  // Storage interface for future expansion
}

export class MemStorage implements IStorage {
  constructor() {
    // No storage needed for VNC client
  }
}

export const storage = new MemStorage();
