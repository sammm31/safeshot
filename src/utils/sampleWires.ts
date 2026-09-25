import { WireStatus } from '../types/inspection';
import { createSyntheticSvgUri, SYNTHETIC_PRESETS } from './syntheticImageGenerator';

export interface SampleWirePreset {
  id: string;
  title: string;
  subtitle: string;
  condition: WireStatus;
  uri: string;
  tag: string;
  outerLuminance: number;
  innerLuminance: number;
}

/**
 * Synthetic Inspection Datasets
 * Follows strict geometric rules:
 * 1. Large outer circle (inspection zone)
 * 2. Clearly visible inner square (concentric center)
 * 3. Flat simple regions with clear boundaries
 * 4. Relative brightness governs classification:
 *    - SAFE: Square is clearly LIGHTER than Circle
 *    - BORDERLINE: Square has approximately SAME brightness as Circle
 *    - DAMAGED: Square is SAME or DARKER than Circle
 */
export const SAMPLE_WIRES: SampleWirePreset[] = SYNTHETIC_PRESETS.map((preset) => {
  return {
    id: preset.id,
    title: preset.name,
    subtitle: preset.notes,
    condition: preset.condition,
    uri: createSyntheticSvgUri({
      condition: preset.condition,
      outerColor: preset.outerCircleColor,
      innerColor: preset.innerSquareColor,
      specimenId: preset.id,
    }),
    tag: `${preset.condition} Pattern`,
    outerLuminance: preset.outerCircleLuminance,
    innerLuminance: preset.innerSquareLuminance,
  };
});
