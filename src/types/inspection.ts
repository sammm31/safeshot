export type WireStatus = 'SAFE' | 'BORDERLINE' | 'DAMAGED';

export interface InspectionDetails {
  wireType: string;
  insulationIntegrity: string;
  defectDetected: string;
  recommendation: string;
  metricScore: number;
}

export interface WireInspectionResult {
  id: string;
  imageUri: string;
  status: WireStatus;
  confidence: number; // Percentage e.g. 96.5
  message: string;
  timestamp: string;
  details: InspectionDetails;
  isDemo?: boolean;
}
