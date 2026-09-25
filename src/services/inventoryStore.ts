import { useState, useEffect } from 'react';
import { BatchItem, BatchStatus, DispenseTransaction } from '../types/inventory';

// Generate dynamic expiry dates relative to current date
const now = new Date();
const addDays = (d: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split('T')[0];
};

const INITIAL_BATCHES: BatchItem[] = [
  {
    id: 'BTH-01',
    vaccineName: 'Covaxin Inactivated Vial',
    batchNumber: 'COV-2026-X41',
    totalQuantity: 60,
    availableQuantity: 42,
    expiryDate: addDays(45), // ~45 days
    status: 'ACTIVE',
    manufacturer: 'Bharat Biotech Ltd.',
    storageTemp: '2°C – 8°C',
    dosage: '0.5 mL / 10 doses per vial',
    dateAdded: '2026-08-10',
    notes: 'Primary pediatric & adult immunization stock.',
  },
  {
    id: 'BTH-02',
    vaccineName: 'Polio IPV Salk Lyophilized',
    batchNumber: 'IPV-2026-P09',
    totalQuantity: 80,
    availableQuantity: 8, // Low stock!
    expiryDate: addDays(14), // Expiring soon in 14 days!
    status: 'EXPIRING_SOON',
    manufacturer: 'Serum Institute of India',
    storageTemp: '2°C – 8°C (Do Not Freeze)',
    dosage: '0.5 mL / 5 doses per vial',
    dateAdded: '2026-07-22',
    notes: 'Critical cold-chain monitoring required. VVM Stage II.',
  },
  {
    id: 'BTH-03',
    vaccineName: 'BCG Tuberculosis Vaccine',
    batchNumber: 'BCG-2026-B12',
    totalQuantity: 50,
    availableQuantity: 37,
    expiryDate: addDays(120),
    status: 'ACTIVE',
    manufacturer: 'Statens Serum Institut',
    storageTemp: '2°C – 8°C (Protect from Light)',
    dosage: '0.1 mL intradermal / 20 doses',
    dateAdded: '2026-08-28',
    notes: 'Reconstitute only with supplied saline diluent.',
  },
  {
    id: 'BTH-04',
    vaccineName: 'MMR Attenuated Live Vial',
    batchNumber: 'MMR-2026-M88',
    totalQuantity: 45,
    availableQuantity: 31,
    expiryDate: addDays(180),
    status: 'ACTIVE',
    manufacturer: 'Merck & Co.',
    storageTemp: '2°C – 8°C',
    dosage: '0.5 mL subcutaneous / 1 dose',
    dateAdded: '2026-09-01',
    notes: 'Routine vaccination schedule stock.',
  },
  {
    id: 'BTH-05',
    vaccineName: 'Hepatitis-B Recombinant',
    batchNumber: 'HPB-2026-H04',
    totalQuantity: 40,
    availableQuantity: 4, // Low stock!
    expiryDate: addDays(22), // Expiring soon!
    status: 'LOW_STOCK',
    manufacturer: 'GlaxoSmithKline',
    storageTemp: '2°C – 8°C (Shake well before use)',
    dosage: '1.0 mL adult dose',
    dateAdded: '2026-07-05',
    notes: 'Reorder triggered with medical supplier.',
  },
];

const INITIAL_TRANSACTIONS: DispenseTransaction[] = [
  {
    id: 'TXN-901',
    batchId: 'BTH-02',
    batchNumber: 'IPV-2026-P09',
    vaccineName: 'Polio IPV Salk Lyophilized',
    quantityDispensed: 1,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    technicianName: 'Dr. Sarah Jenkins',
    recipientWard: 'Pediatric OPD Room 4',
    notes: 'Routine infant immunization verified safe with Safe Shot.',
  },
  {
    id: 'TXN-902',
    batchId: 'BTH-01',
    batchNumber: 'COV-2026-X41',
    vaccineName: 'Covaxin Inactivated Vial',
    quantityDispensed: 2,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    technicianName: 'Dr. Sarah Jenkins',
    recipientWard: 'Outpatient Clinic B',
    notes: 'Batch verified via optical circle-square VVM check.',
  },
];

type InventoryListener = () => void;

class InventoryStore {
  private batches: BatchItem[] = [...INITIAL_BATCHES];
  private transactions: DispenseTransaction[] = [...INITIAL_TRANSACTIONS];
  private listeners: Set<InventoryListener> = new Set();

  public getBatches(): BatchItem[] {
    return [...this.batches];
  }

  public getBatchById(id: string): BatchItem | undefined {
    return this.batches.find((b) => b.id === id);
  }

  public getTransactions(): DispenseTransaction[] {
    return [...this.transactions];
  }

  /**
   * Returns batches that are expiring in 30 days or low in stock
   */
  public getExpiringSoonBatches(): BatchItem[] {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + 30);
    const thresholdStr = thresholdDate.toISOString().split('T')[0];

    return this.batches.filter((b) => {
      return (b.expiryDate <= thresholdStr || b.status === 'EXPIRING_SOON') && b.availableQuantity > 0;
    });
  }

  /**
   * Dispenses a vial from a batch:
   * 1. Decreases availableQuantity immediately
   * 2. Recalculates batch status (e.g. LOW_STOCK or EXPIRED)
   * 3. Creates transaction record
   * 4. Notifies subscribers
   */
  public dispenseVial(params: {
    batchId: string;
    quantity?: number;
    technicianName?: string;
    recipientWard?: string;
    notes?: string;
  }): { success: boolean; message: string; updatedBatch?: BatchItem } {
    const qty = params.quantity || 1;
    const batchIndex = this.batches.findIndex((b) => b.id === params.batchId);

    if (batchIndex === -1) {
      return { success: false, message: 'Batch not found.' };
    }

    const batch = this.batches[batchIndex];

    if (batch.availableQuantity < qty) {
      return {
        success: false,
        message: `Insufficient inventory. Only ${batch.availableQuantity} vial(s) remaining in this batch.`,
      };
    }

    const newAvailable = batch.availableQuantity - qty;
    let newStatus: BatchStatus = batch.status;

    if (newAvailable <= 0) {
      newStatus = 'LOW_STOCK';
    } else if (newAvailable <= 10) {
      newStatus = 'LOW_STOCK';
    }

    const updatedBatch: BatchItem = {
      ...batch,
      availableQuantity: newAvailable,
      status: newStatus,
    };

    this.batches[batchIndex] = updatedBatch;

    // Record the transaction
    const newTxn: DispenseTransaction = {
      id: `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      vaccineName: batch.vaccineName,
      quantityDispensed: qty,
      timestamp: new Date().toISOString(),
      technicianName: params.technicianName || 'Dr. Sarah Jenkins',
      recipientWard: params.recipientWard || 'Immunization Unit',
      notes: params.notes || 'Dispensed after optical safety verification.',
    };

    this.transactions.unshift(newTxn);
    this.notify();

    return {
      success: true,
      message: `Dispensed ${qty} vial(s) of ${batch.vaccineName}. Remaining: ${newAvailable}`,
      updatedBatch,
    };
  }

  /**
   * Adds a new vaccine batch to inventory
   */
  public addBatch(batchData: Omit<BatchItem, 'id' | 'status' | 'dateAdded'>): BatchItem {
    const id = `BTH-${Date.now().toString(36).toUpperCase()}`;
    const today = new Date().toISOString().split('T')[0];

    // Determine status
    let status: BatchStatus = 'ACTIVE';
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    const thirtyDaysStr = thirtyDaysLater.toISOString().split('T')[0];

    if (batchData.expiryDate <= thirtyDaysStr) {
      status = 'EXPIRING_SOON';
    } else if (batchData.availableQuantity <= 10) {
      status = 'LOW_STOCK';
    }

    const newBatch: BatchItem = {
      id,
      ...batchData,
      status,
      dateAdded: today,
    };

    this.batches.unshift(newBatch);
    this.notify();
    return newBatch;
  }

  public resetDefaults(): void {
    this.batches = [...INITIAL_BATCHES];
    this.transactions = [...INITIAL_TRANSACTIONS];
    this.notify();
  }

  public subscribe(listener: InventoryListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('InventoryStore notification error:', err);
      }
    });
  }
}

export const inventoryStore = new InventoryStore();

export function useInventory() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return inventoryStore.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, []);

  return {
    batches: inventoryStore.getBatches(),
    transactions: inventoryStore.getTransactions(),
    expiringSoonBatches: inventoryStore.getExpiringSoonBatches(),
    dispenseVial: inventoryStore.dispenseVial.bind(inventoryStore),
    addBatch: inventoryStore.addBatch.bind(inventoryStore),
    resetDefaults: inventoryStore.resetDefaults.bind(inventoryStore),
  };
}
