import { InspectionStatus, WireStatus } from '../types/inspection';

export interface SyntheticSpecimenParams {
  id: string;
  name: string;
  condition: InspectionStatus;
  outerCircleColor: string;
  outerCircleLuminance: number; // 0 to 100
  innerSquareColor: string;
  innerSquareLuminance: number; // 0 to 100
  notes: string;
}

/**
 * Computes relative luminance (0-100) from hex color
 */
export function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  // Standard perceptual luminance formula
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return Math.round(lum * 100);
}

/**
 * Builds a clean, flat synthetic SVG data URI following strict geometric constraints:
 * 1. Large OUTER CIRCLE (inspection area, centered at 200,200, radius 135)
 * 2. Clearly visible INNER SQUARE (centered at 200,200, size 90x90)
 * 3. Flat simple visual regions with crisp clean boundaries
 * 4. Pure flat synthetic geometry with crisp boundaries
 */
export function createSyntheticSvgUri(params: {
  condition: InspectionStatus;
  outerColor: string;
  innerColor: string;
  specimenId?: string;
}): string {
  const { condition, outerColor, innerColor, specimenId = 'SYN-SPECIMEN' } = params;

  const outerLum = getLuminance(outerColor);
  const innerLum = getLuminance(innerColor);
  const lumDelta = innerLum - outerLum;

  // Clean SVG markup with strict geometry
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" data-condition="${condition}" data-outer-lum="${outerLum}" data-inner-lum="${innerLum}" data-delta="${lumDelta}">
  <!-- Neutral Inspection Backdrop -->
  <rect width="400" height="400" fill="%230F172A"/>

  <!-- Technical Calibration Alignment Reticle -->
  <circle cx="200" cy="200" r="170" fill="none" stroke="%231E293B" stroke-width="1.5" stroke-dasharray="4 4"/>
  <line x1="200" y1="15" x2="200" y2="45" stroke="%23334155" stroke-width="1.5"/>
  <line x1="200" y1="355" x2="200" y2="385" stroke="%23334155" stroke-width="1.5"/>
  <line x1="15" y1="200" x2="45" y2="200" stroke="%23334155" stroke-width="1.5"/>
  <line x1="355" y1="200" x2="385" y2="200" stroke="%23334155" stroke-width="1.5"/>

  <!-- 1. Large OUTER CIRCLE: Target Inspection Area -->
  <circle cx="200" cy="200" r="135" fill="${encodeURIComponent(outerColor)}" stroke="%23475569" stroke-width="2"/>

  <!-- 2. Clearly Visible INNER SQUARE: Center Region -->
  <rect x="155" y="155" width="90" height="90" fill="${encodeURIComponent(innerColor)}" stroke="%2364748B" stroke-width="1.5"/>

  <!-- Technical Specimen Metadata Header & Footer -->
  <text x="200" y="32" fill="%2394A3B8" font-family="monospace" font-size="11" font-weight="600" text-anchor="middle" letter-spacing="1">SYNTHETIC CV SPECIMEN // ${specimenId}</text>
  <text x="200" y="380" fill="%2364748B" font-family="monospace" font-size="10" text-anchor="middle">OUTER L:${outerLum}% | INNER L:${innerLum}% | DELTA:${lumDelta > 0 ? '+' : ''}${lumDelta}%</text>
</svg>`;

  return `data:image/svg+xml;utf8,${svg}`;
}

/**
 * Standard synthetic presets enforcing the exact photometric rules:
 * - SAFE: inner square is clearly LIGHTER than outer circle (delta > +25%)
 * - BORDERLINE: inner square has approximately the SAME brightness as outer circle (|delta| <= 5%)
 * - DAMAGED: inner square is the SAME or DARKER than outer circle (delta < -25%)
 */
export const SYNTHETIC_PRESETS: SyntheticSpecimenParams[] = [
  {
    id: 'SYN-SAFE-01',
    name: 'Specimen S-01 (Safe)',
    condition: 'SAFE',
    outerCircleColor: '#2D3748', // Darker tone (L ~ 24%)
    outerCircleLuminance: 24,
    innerSquareColor: '#F8FAFC', // Clearly lighter (L ~ 98%)
    innerSquareLuminance: 98,
    notes: 'Inner square is clearly LIGHTER than outer circle (Delta: +74%). Nominal condition.',
  },
  {
    id: 'SYN-SAFE-02',
    name: 'Specimen S-02 (Safe)',
    condition: 'SAFE',
    outerCircleColor: '#1E293B', // Dark slate (L ~ 18%)
    outerCircleLuminance: 18,
    innerSquareColor: '#E2E8F0', // Very light gray (L ~ 90%)
    innerSquareLuminance: 90,
    notes: 'Inner square is clearly LIGHTER than outer circle (Delta: +72%). High contrast pass.',
  },
  {
    id: 'SYN-BORDERLINE-01',
    name: 'Specimen B-01 (Borderline)',
    condition: 'BORDERLINE',
    outerCircleColor: '#64748B', // Mid slate (L ~ 47%)
    outerCircleLuminance: 47,
    innerSquareColor: '#627289', // Approximately SAME brightness (L ~ 46%)
    innerSquareLuminance: 46,
    notes: 'Inner square has approximately the SAME brightness/color as outer circle (Delta: -1%).',
  },
  {
    id: 'SYN-BORDERLINE-02',
    name: 'Specimen B-02 (Borderline)',
    condition: 'BORDERLINE',
    outerCircleColor: '#718096', // Neutral gray (L ~ 52%)
    outerCircleLuminance: 52,
    innerSquareColor: '#6E7D93', // Approximately SAME brightness (L ~ 51%)
    innerSquareLuminance: 51,
    notes: 'Inner square matches outer circle luminance (Delta: -1%). Equi-luminance threshold.',
  },
  {
    id: 'SYN-DAMAGED-01',
    name: 'Specimen D-01 (Damaged)',
    condition: 'DAMAGED',
    outerCircleColor: '#94A3B8', // Lighter circle (L ~ 68%)
    outerCircleLuminance: 68,
    innerSquareColor: '#0F172A', // Clearly DARKER inner square (L ~ 11%)
    innerSquareLuminance: 11,
    notes: 'Inner square is clearly DARKER than outer circle (Delta: -57%). Anomaly detected.',
  },
  {
    id: 'SYN-DAMAGED-02',
    name: 'Specimen D-02 (Damaged)',
    condition: 'DAMAGED',
    outerCircleColor: '#A0AEC0', // Mid-light circle (L ~ 71%)
    outerCircleLuminance: 71,
    innerSquareColor: '#1A202C', // Very dark inner square (L ~ 14%)
    innerSquareLuminance: 14,
    notes: 'Inner square is clearly DARKER than outer circle (Delta: -57%). Critical deficit.',
  },
];
