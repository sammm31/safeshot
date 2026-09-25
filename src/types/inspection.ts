export type InspectionStatus = 'SAFE' | 'BORDERLINE' | 'DISCARD' | 'DAMAGED';
// Alias for backwards compatibility
export type WireStatus = InspectionStatus;

export interface VialBatchInfo {
  batchNumber: string;
  vaccineName: string;
  expiryDate: string;
  manufacturer?: string;
  storageTemp?: string;
}

export interface InspectionDetails {
  specimenType: string;
  wireType?: string; // backwards compatibility alias
  insulationIntegrity: string;
  defectDetected: string;
  recommendation: string;
  metricScore: number;
}

export interface InspectionResult {
  id: string;
  imageUri: string;
  status: InspectionStatus;
  confidence: number; // Percentage e.g. 96.5
  message: string;
  timestamp: string;
  details: InspectionDetails;
  isDemo?: boolean;
  vialBatch?: VialBatchInfo;
  isSaved?: boolean;
}

// Alias for backwards compatibility
export type WireInspectionResult = InspectionResult;
