import { InspectionStatus, WireStatus } from '../types/inspection';
import { colors } from '../theme/colors';

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function formatDateTime(isoString: string): string {
  const date = formatDate(isoString);
  const time = formatTime(isoString);
  return time ? `${date} • ${time}` : date;
}

export function getStatusTheme(status: InspectionStatus) {
  switch (status) {
    case 'SAFE':
      return {
        label: 'SAFE',
        color: colors.statusSafe,
        bgColor: colors.statusSafeBg,
        borderColor: colors.statusSafeBorder,
        glowColor: colors.statusSafeGlow,
        icon: 'checkmark-circle' as const,
        featherIcon: 'check-circle' as const,
        description: 'Specimen appears safe based on the current inspection.',
      };
    case 'BORDERLINE':
      return {
        label: 'BORDERLINE',
        color: colors.statusBorderline,
        bgColor: colors.statusBorderlineBg,
        borderColor: colors.statusBorderlineBorder,
        glowColor: colors.statusBorderlineGlow,
        icon: 'warning' as const,
        featherIcon: 'alert-triangle' as const,
        description: 'Inspection indicates a condition that may require further checking.',
      };
    case 'DAMAGED':
      return {
        label: 'DAMAGED',
        color: colors.statusDamaged,
        bgColor: colors.statusDamagedBg,
        borderColor: colors.statusDamagedBorder,
        glowColor: colors.statusDamagedGlow,
        icon: 'alert-circle' as const,
        featherIcon: 'alert-octagon' as const,
        description: 'Visible indicators suggest the specimen may require attention.',
      };
  }
}
