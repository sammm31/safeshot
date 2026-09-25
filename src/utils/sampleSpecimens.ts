import { InspectionStatus } from '../types/inspection';
import { createSyntheticSvgUri, SYNTHETIC_PRESETS } from './syntheticImageGenerator';

export interface SamplePreset {
  id: string;
  title: string;
  subtitle: string;
  condition: InspectionStatus;
  uri: string;
  tag: string;
  outerLuminance: number;
  innerLuminance: number;
}

/**
 * Synthetic Vaccine Vial Monitor (VVM) Inspection Datasets
 * Follows strict geometric rules:
 * 1. Large outer circle (vial cap/indicator reference zone)
 * 2. Clearly visible inner square (concentric heat-sensitive VVM square)
 * 3. Flat simple regions with clear boundaries
 * 4. Relative brightness governs classification:
 *    - SAFE: Square is clearly LIGHTER than Circle
 *    - BORDERLINE: Square has approximately SAME brightness as Circle
 *    - DISCARD: Square is SAME or DARKER than Circle
 */
export const SAMPLE_SPECIMENS: SamplePreset[] = SYNTHETIC_PRESETS.map((preset) => {
  return {
    id: preset.id,
    title: preset.name.replace('Damaged', 'Discard'),
    subtitle: preset.notes,
    condition: preset.condition,
    uri: createSyntheticSvgUri({
      condition: preset.condition,
      outerColor: preset.outerCircleColor,
      innerColor: preset.innerSquareColor,
      specimenId: preset.id,
    }),
    tag: `${preset.condition === 'DAMAGED' ? 'DISCARD' : preset.condition} Vial`,
    outerLuminance: preset.outerCircleLuminance,
    innerLuminance: preset.innerSquareLuminance,
  };
});
