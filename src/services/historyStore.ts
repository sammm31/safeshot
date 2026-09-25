import { useEffect, useState } from 'react';
import { InspectionResult, InspectionStatus } from '../types/inspection';
import { SAMPLE_SPECIMENS } from '../utils/sampleWires';

// Pre-seeded vial inspection records using synthetic VVM circle-square dataset
const INITIAL_RECORDS: InspectionResult[] = [
  {
    id: 'SSH-VIAL-9041',
    imageUri: SAMPLE_SPECIMENS[0].uri,
    status: 'SAFE',
    confidence: 98.4,
    message: 'Inner square is clearly lighter than the outer circle. Vaccine Vial Monitor (VVM) is intact.',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    details: {
      specimenType: 'Covaxin Inactivated Vial (COV-2026-X41)',
      insulationIntegrity: 'Outer Ring: L=24% | Inner VVM Square: L=98% (Delta: +74%)',
      defectDetected: 'None (positive luminance gradient, VVM Stage I)',
      recommendation: 'Cold chain intact. Vial passes safety inspection and is approved for clinical administration.',
      metricScore: 98,
    },
    vialBatch: {
      batchNumber: 'COV-2026-X41',
      vaccineName: 'Covaxin Inactivated Vial',
      expiryDate: '2026-11-10',
      manufacturer: 'Bharat Biotech Ltd.',
      storageTemp: '2°C – 8°C',
    },
    isDemo: true,
    isSaved: true,
  },
  {
    id: 'SSH-VIAL-8812',
    imageUri: SAMPLE_SPECIMENS[2].uri,
    status: 'BORDERLINE',
    confidence: 88.6,
    message: 'Inner square has approximately the same brightness as outer circle. VVM discard point approaching.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
    details: {
      specimenType: 'Polio IPV Salk Lyophilized (IPV-2026-P09)',
      insulationIntegrity: 'Outer Ring: L=47% | Inner VVM Square: L=46% (Equi-luminance)',
      defectDetected: 'Low contrast boundary (equi-luminance delta: -1%, VVM Stage II)',
      recommendation: 'Vial is at the discard transition threshold. Use first if before expiry, or verify cold-chain logger.',
      metricScore: 66,
    },
    vialBatch: {
      batchNumber: 'IPV-2026-P09',
      vaccineName: 'Polio IPV Salk Lyophilized',
      expiryDate: '2026-10-10',
      manufacturer: 'Serum Institute of India',
      storageTemp: '2°C – 8°C (Do Not Freeze)',
    },
    isDemo: true,
    isSaved: true,
  },
  {
    id: 'SSH-VIAL-8420',
    imageUri: SAMPLE_SPECIMENS[4].uri,
    status: 'DISCARD',
    confidence: 95.8,
    message: 'Inner square is darker than the outer circle. Cumulative heat exposure limit exceeded.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    details: {
      specimenType: 'Hepatitis-B Recombinant (HPB-2026-H04)',
      insulationIntegrity: 'Outer Ring: L=68% | Inner VVM Square: L=11% (Negative gradient)',
      defectDetected: 'Inverted contrast deficit (Delta: -57%, VVM Stage IV)',
      recommendation: 'DO NOT ADMINISTER. Vaccine has exceeded heat exposure threshold. Discard vial in biohazard waste.',
      metricScore: 18,
    },
    vialBatch: {
      batchNumber: 'HPB-2026-H04',
      vaccineName: 'Hepatitis-B Recombinant',
      expiryDate: '2026-10-18',
      manufacturer: 'GlaxoSmithKline',
      storageTemp: '2°C – 8°C',
    },
    isDemo: true,
    isSaved: true,
  },
  {
    id: 'SSH-VIAL-7935',
    imageUri: SAMPLE_SPECIMENS[1].uri,
    status: 'SAFE',
    confidence: 97.2,
    message: 'Inner square is clearly lighter than the outer circle. Vaccine Vial Monitor (VVM) is intact.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    details: {
      specimenType: 'BCG Tuberculosis Vaccine (BCG-2026-B12)',
      insulationIntegrity: 'Outer Ring: L=18% | Inner VVM Square: L=90% (Delta: +72%)',
      defectDetected: 'None (positive luminance gradient, VVM Stage I)',
      recommendation: 'Cold chain verified intact. Vial cleared for intradermal administration.',
      metricScore: 97,
    },
    vialBatch: {
      batchNumber: 'BCG-2026-B12',
      vaccineName: 'BCG Tuberculosis Vaccine',
      expiryDate: '2027-01-25',
      manufacturer: 'Statens Serum Institut',
      storageTemp: '2°C – 8°C (Protect from Light)',
    },
    isDemo: true,
    isSaved: true,
  },
];

let records: InspectionResult[] = [...INITIAL_RECORDS];
type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error('HistoryStore notification error:', err);
    }
  });
}

export const historyStore = {
  getAll(): InspectionResult[] {
    return [...records];
  },

  getById(id: string): InspectionResult | undefined {
    return records.find((item) => item.id === id);
  },

  getStats(): { total: number; safe: number; borderline: number; discard: number } {
    let safe = 0;
    let borderline = 0;
    let discard = 0;

    records.forEach((r) => {
      if (r.status === 'SAFE') safe++;
      else if (r.status === 'BORDERLINE') borderline++;
      else if (r.status === 'DISCARD' || r.status === 'DAMAGED') discard++;
    });

    return {
      total: records.length,
      safe,
      borderline,
      discard,
    };
  },

  add(item: InspectionResult): void {
    // Avoid duplicate IDs
    records = [item, ...records.filter((r) => r.id !== item.id)];
    notify();
  },

  markSaved(id: string): void {
    const idx = records.findIndex((r) => r.id === id);
    if (idx !== -1) {
      records[idx] = { ...records[idx], isSaved: true };
      notify();
    }
  },

  remove(id: string): void {
    records = records.filter((r) => r.id !== id);
    notify();
  },

  clear(): void {
    records = [];
    notify();
  },

  resetDefaults(): void {
    records = [...INITIAL_RECORDS];
    notify();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useHistory() {
  const [data, setData] = useState<InspectionResult[]>(() => historyStore.getAll());

  useEffect(() => {
    return historyStore.subscribe(() => {
      setData(historyStore.getAll());
    });
  }, []);

  return data;
}

export function useInspectionStats() {
  const [stats, setStats] = useState(() => historyStore.getStats());

  useEffect(() => {
    return historyStore.subscribe(() => {
      setStats(historyStore.getStats());
    });
  }, []);

  return stats;
}
