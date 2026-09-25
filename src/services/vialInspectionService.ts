import { InspectionResult, InspectionStatus, VialBatchInfo } from '../types/inspection';

export interface AnalyzeVialParams {
  imageUri: string;
  batchInfo?: VialBatchInfo;
}

/**
 * Safe Shot Smart Vial Safety Inspection Service (Mock Implementation)
 * 
 * Optical Vaccine Vial Monitor (VVM) Model:
 * 1. Geometry: Outer Circle (vial cap/indicator reference ring) + Inner Square (heat-sensitive VVM square).
 * 2. Photometric Rule:
 *    - SAFE: Inner square is clearly LIGHTER than outer circle (nominal cold chain).
 *    - BORDERLINE: Inner square has approximately the SAME brightness/color as outer circle (transition zone).
 *    - DISCARD: Inner square is the SAME or DARKER than outer circle (heat exposure limit exceeded).
 */
export async function analyzeVial(params: AnalyzeVialParams | string): Promise<InspectionResult> {
  const imageUri = typeof params === 'string' ? params : params.imageUri;
  const batchInfo = typeof params === 'object' ? params.batchInfo : undefined;

  // Simulate CV inference processing latency (1.2 - 1.6 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const lowerUri = (imageUri || '').toLowerCase();

  let outerLum = 45;
  let innerLum = 45;
  let status: InspectionStatus = 'BORDERLINE';
  let confidence = 89.2;

  // 1. Check for embedded synthetic dataset tags
  const outerMatch = imageUri.match(/data-outer-lum="(\d+)"/);
  const innerMatch = imageUri.match(/data-inner-lum="(\d+)"/);
  const conditionMatch = imageUri.match(/data-condition="(SAFE|BORDERLINE|DAMAGED|DISCARD)"/i);

  if (outerMatch && innerMatch) {
    outerLum = parseInt(outerMatch[1], 10);
    innerLum = parseInt(innerMatch[1], 10);
  } else if (conditionMatch) {
    const cond = conditionMatch[1].toUpperCase();
    if (cond === 'SAFE') {
      outerLum = 24;
      innerLum = 96;
    } else if (cond === 'DISCARD' || cond === 'DAMAGED') {
      outerLum = 72;
      innerLum = 12;
    } else {
      outerLum = 48;
      innerLum = 47;
    }
  } else if (lowerUri.includes('safe') || lowerUri.includes('s-01') || lowerUri.includes('s-02')) {
    outerLum = 22;
    innerLum = 95;
  } else if (lowerUri.includes('discard') || lowerUri.includes('damaged') || lowerUri.includes('d-01') || lowerUri.includes('d-02') || lowerUri.includes('dark')) {
    outerLum = 70;
    innerLum = 14;
  } else if (lowerUri.includes('borderline') || lowerUri.includes('b-01') || lowerUri.includes('b-02') || lowerUri.includes('same')) {
    outerLum = 48;
    innerLum = 47;
  } else {
    // Fallback: estimate from hash for general camera/gallery uploads
    const hash = simpleHash(imageUri);
    const mod = hash % 3;
    if (mod === 0) {
      // Safe: inner lighter
      outerLum = 25 + (hash % 10);
      innerLum = 92 + (hash % 6);
    } else if (mod === 1) {
      // Borderline: same brightness
      outerLum = 48 + (hash % 6);
      innerLum = outerLum + (hash % 3 === 0 ? 1 : hash % 3 === 1 ? -1 : 0);
    } else {
      // Discard: inner darker
      outerLum = 68 + (hash % 8);
      innerLum = 15 + (hash % 10);
    }
  }

  // Calculate photometric delta
  const delta = innerLum - outerLum;

  let message = '';
  let defectDetected = '';
  let insulationIntegrity = '';
  let recommendation = '';
  let metricScore = 50;

  // SAFE: inner square is clearly LIGHTER than the outer circle
  if (delta >= 15) {
    status = 'SAFE';
    confidence = 96.8 + Math.min(2.5, Math.abs(delta) / 40);
    message = 'Inner square is clearly lighter than the outer circle. Vaccine Vial Monitor (VVM) is intact.';
    defectDetected = 'None (positive luminance gradient, VVM Stage I)';
    insulationIntegrity = `Outer Ring: L=${outerLum}% | Inner VVM Square: L=${innerLum}% (Delta: +${delta}%)`;
    recommendation = 'Cold chain intact. Vial passes safety inspection and is approved for clinical administration.';
    metricScore = 96;
  }
  // BORDERLINE: inner square has approximately the SAME brightness/color as the outer circle
  else if (Math.abs(delta) < 15 && delta > -10) {
    status = 'BORDERLINE';
    confidence = 88.0 + (Math.random() * 2);
    message = 'Inner square has approximately the same brightness as outer circle. VVM discard point approaching.';
    defectDetected = `Equi-luminance threshold reached (Delta: ${delta >= 0 ? '+' : ''}${delta}%)`;
    insulationIntegrity = `Outer Ring: L=${outerLum}% | Inner VVM Square: L=${innerLum}% (Equi-luminance)`;
    recommendation = 'Vial is at the discard transition threshold. Use first if before expiry, or verify cold-chain logger.';
    metricScore = 65;
  }
  // DISCARD: inner square is the SAME or DARKER than the outer circle
  else {
    status = 'DISCARD';
    confidence = 94.5 + Math.min(4.5, Math.abs(delta) / 30);
    message = 'Inner square is darker than the outer circle. Cumulative heat exposure limit exceeded.';
    defectDetected = `Inverted contrast deficit (Delta: ${delta}%, VVM Stage IV)`;
    insulationIntegrity = `Outer Ring: L=${outerLum}% | Inner VVM Square: L=${innerLum}% (Negative gradient)`;
    recommendation = 'DO NOT ADMINISTER. Vaccine has exceeded heat exposure threshold. Discard vial in biohazard waste.';
    metricScore = 18;
  }

  confidence = Math.min(99.4, Math.max(82.0, parseFloat(confidence.toFixed(1))));
  const id = `SSH-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  return {
    id,
    imageUri,
    status,
    confidence,
    message,
    timestamp: new Date().toISOString(),
    details: {
      specimenType: batchInfo ? `${batchInfo.vaccineName} (${batchInfo.batchNumber})` : 'Vaccine Vial Optical Monitor',
      insulationIntegrity,
      defectDetected,
      recommendation,
      metricScore,
    },
    vialBatch: batchInfo,
    isDemo: true,
    isSaved: false,
  };
}

// Backwards compatibility alias
export const analyzeSpecimen = analyzeVial;
export const analyzeWire = analyzeVial;

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
