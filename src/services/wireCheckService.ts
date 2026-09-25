import { WireInspectionResult, WireStatus } from '../types/inspection';

/**
 * WireCheck Computer Vision Inspection Service (Mock Implementation)
 * 
 * Synthetic Visual Model Rule:
 * 1. Geometry: Outer Circle (inspection zone) with centered Inner Square.
 * 2. Photometric Rule:
 *    - SAFE: Inner square is clearly LIGHTER than outer circle (L_inner >> L_outer).
 *    - BORDERLINE: Inner square has approximately the SAME brightness/color as outer circle (L_inner ≈ L_outer).
 *    - DAMAGED: Inner square is the SAME or DARKER than outer circle (L_inner <= L_outer).
 */
export async function analyzeWire(imageUri: string): Promise<WireInspectionResult> {
  // Simulate CV inference processing latency (1.4 - 1.8 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerUri = (imageUri || '').toLowerCase();

  let outerLum = 45;
  let innerLum = 45;
  let status: WireStatus = 'BORDERLINE';
  let confidence = 88.5;

  // 1. Check for embedded synthetic dataset tags
  const outerMatch = imageUri.match(/data-outer-lum="(\d+)"/);
  const innerMatch = imageUri.match(/data-inner-lum="(\d+)"/);
  const conditionMatch = imageUri.match(/data-condition="(SAFE|BORDERLINE|DAMAGED)"/i);

  if (outerMatch && innerMatch) {
    outerLum = parseInt(outerMatch[1], 10);
    innerLum = parseInt(innerMatch[1], 10);
  } else if (conditionMatch) {
    const cond = conditionMatch[1].toUpperCase() as WireStatus;
    if (cond === 'SAFE') {
      outerLum = 24;
      innerLum = 96;
    } else if (cond === 'DAMAGED') {
      outerLum = 72;
      innerLum = 12;
    } else {
      outerLum = 48;
      innerLum = 47;
    }
  } else if (lowerUri.includes('safe') || lowerUri.includes('s-01') || lowerUri.includes('s-02')) {
    outerLum = 22;
    innerLum = 95;
  } else if (lowerUri.includes('damaged') || lowerUri.includes('d-01') || lowerUri.includes('d-02') || lowerUri.includes('dark')) {
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
      // Damaged: inner darker
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

  // STRICT USER CONSTRAINTS:
  // SAFE: inner square is clearly LIGHTER than the outer circle
  if (delta >= 15) {
    status = 'SAFE';
    confidence = 96.8 + Math.min(2.5, Math.abs(delta) / 40);
    message = 'Inner square is clearly lighter than the outer circle. Nominal condition (SAFE).';
    defectDetected = 'None (positive luminance gradient, L_inner > L_outer)';
    insulationIntegrity = `Outer Circle: L=${outerLum}% | Inner Square: L=${innerLum}% (Delta: +${delta}%)`;
    recommendation = 'Concentric inspection passes all brightness thresholds. Specimen is verified safe.';
    metricScore = 96;
  }
  // BORDERLINE: inner square has approximately the SAME brightness/color as the outer circle
  else if (Math.abs(delta) < 15 && delta > -10) {
    status = 'BORDERLINE';
    confidence = 88.0 + Math.random() * 2;
    message = 'Inner square has approximately the same brightness/color as the outer circle.';
    defectDetected = `Low contrast boundary (equi-luminance delta: ${delta >= 0 ? '+' : ''}${delta}%)`;
    insulationIntegrity = `Outer Circle: L=${outerLum}% | Inner Square: L=${innerLum}% (Equi-luminance)`;
    recommendation = 'Luminance contrast is within ambiguity band. Further calibration or secondary inspection required.';
    metricScore = 65;
  }
  // DAMAGED/UNSAFE: inner square is the SAME or DARKER than the outer circle
  else {
    status = 'DAMAGED';
    confidence = 94.5 + Math.min(4.5, Math.abs(delta) / 30);
    message = 'Inner square is darker than the outer circle. Anomaly detected (DAMAGED).';
    defectDetected = `Inverted contrast deficit (Delta: ${delta}%, L_inner <= L_outer)`;
    insulationIntegrity = `Outer Circle: L=${outerLum}% | Inner Square: L=${innerLum}% (Negative gradient)`;
    recommendation = 'Deficit threshold exceeded: Core square failed brightness check. Decommission specimen.';
    metricScore = 22;
  }

  confidence = Math.min(99.4, Math.max(82.0, parseFloat(confidence.toFixed(1))));
  const id = `SYN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  return {
    id,
    imageUri,
    status,
    confidence,
    message,
    timestamp: new Date().toISOString(),
    details: {
      wireType: 'Synthetic Circle-Square Specimen',
      insulationIntegrity,
      defectDetected,
      recommendation,
      metricScore,
    },
    isDemo: true,
  };
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
