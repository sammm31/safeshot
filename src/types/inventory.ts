export type BatchStatus = 'ACTIVE' | 'LOW_STOCK' | 'EXPIRING_SOON' | 'EXPIRED';

export interface BatchItem {
  id: string;
  vaccineName: string;
  batchNumber: string;
  totalQuantity: number;
  availableQuantity: number;
  expiryDate: string; // ISO date string or YYYY-MM-DD
  status: BatchStatus;
  manufacturer: string;
  storageTemp: string; // e.g. "2°C – 8°C"
  dosage: string; // e.g. "0.5 mL / 10 doses per vial"
  dateAdded: string;
  notes?: string;
}

export interface DispenseTransaction {
  id: string;
  batchId: string;
  batchNumber: string;
  vaccineName: string;
  quantityDispensed: number;
  timestamp: string;
  technicianName: string;
  recipientWard?: string;
  notes?: string;
}
