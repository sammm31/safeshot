import { useEffect, useState } from 'react';
import { WireInspectionResult } from '../types/inspection';
import { SAMPLE_WIRES } from '../utils/sampleWires';

// Pre-seeded inspection records using synthetic dataset specimens
const INITIAL_RECORDS: WireInspectionResult[] = [
  {
    id: 'SYN-SAFE-9041',
    imageUri: SAMPLE_WIRES[0].uri,
    status: 'SAFE',
    confidence: 98.4,
    message: 'Inner square is clearly lighter than the outer circle. Nominal condition (SAFE).',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    details: {
      wireType: 'Synthetic Circle-Square Specimen',
      insulationIntegrity: 'Outer Circle: L=24% | Inner Square: L=98% (Delta: +74%)',
      defectDetected: 'None (positive luminance gradient, L_inner > L_outer)',
      recommendation: 'Concentric inspection passes all brightness thresholds. Specimen is verified safe.',
      metricScore: 98,
    },
    isDemo: true,
  },
  {
    id: 'SYN-BORDER-8812',
    imageUri: SAMPLE_WIRES[2].uri,
    status: 'BORDERLINE',
    confidence: 88.6,
    message: 'Inner square has approximately the same brightness/color as the outer circle.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(),
    details: {
      wireType: 'Synthetic Circle-Square Specimen',
      insulationIntegrity: 'Outer Circle: L=47% | Inner Square: L=46% (Equi-luminance)',
      defectDetected: 'Low contrast boundary (equi-luminance delta: -1%)',
      recommendation: 'Luminance contrast is within ambiguity band. Secondary verification recommended.',
      metricScore: 66,
    },
    isDemo: true,
  },
  {
    id: 'SYN-DAMAGE-8420',
    imageUri: SAMPLE_WIRES[4].uri,
    status: 'DAMAGED',
    confidence: 95.8,
    message: 'Inner square is darker than the outer circle. Anomaly detected (DAMAGED).',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    details: {
      wireType: 'Synthetic Circle-Square Specimen',
      insulationIntegrity: 'Outer Circle: L=68% | Inner Square: L=11% (Negative gradient)',
      defectDetected: 'Inverted contrast deficit (Delta: -57%, L_inner <= L_outer)',
      recommendation: 'Deficit threshold exceeded: Core square failed brightness check. Decommission specimen.',
      metricScore: 22,
    },
    isDemo: true,
  },
];

let records: WireInspectionResult[] = [...INITIAL_RECORDS];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const historyStore = {
  getAll(): WireInspectionResult[] {
    return records;
  },

  add(inspection: WireInspectionResult) {
    records = [inspection, ...records];
    notify();
  },

  clear() {
    records = [];
    notify();
  },

  resetDefaults() {
    records = [...INITIAL_RECORDS];
    notify();
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useHistory(): WireInspectionResult[] {
  const [data, setData] = useState<WireInspectionResult[]>(() => historyStore.getAll());

  useEffect(() => {
    const unsubscribe = historyStore.subscribe(() => {
      setData([...historyStore.getAll()]);
    });
    return unsubscribe;
  }, []);

  return data;
}
