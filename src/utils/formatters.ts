import { InspectionStatus, WireStatus } from '../types/inspection';
import { BatchStatus } from '../types/inventory';
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
        description: 'Vial appears safe based on the current optical inspection.',
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
        description: 'Vial indicates transition condition that requires secondary check.',
      };
    case 'DISCARD':
    case 'DAMAGED':
    default:
      return {
        label: 'DISCARD',
        color: colors.statusDiscard,
        bgColor: colors.statusDiscardBg,
        borderColor: colors.statusDiscardBorder,
        glowColor: colors.statusDiscardGlow,
        icon: 'close-circle' as const,
        featherIcon: 'alert-octagon' as const,
        description: 'Heat exposure threshold exceeded. Do not administer; discard vial.',
      };
  }
}

export function getBatchStatusTheme(status: BatchStatus) {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'ACTIVE',
        color: colors.statusSafe,
        bgColor: colors.statusSafeBg,
        borderColor: colors.statusSafeBorder,
      };
    case 'EXPIRING_SOON':
      return {
        label: 'EXPIRING SOON',
        color: colors.statusBorderline,
        bgColor: colors.statusBorderlineBg,
        borderColor: colors.statusBorderlineBorder,
      };
    case 'LOW_STOCK':
      return {
        label: 'LOW STOCK',
        color: '#D97706',
        bgColor: '#FEF3C7',
        borderColor: '#FDE68A',
      };
    case 'EXPIRED':
      return {
        label: 'EXPIRED',
        color: colors.statusDiscard,
        bgColor: colors.statusDiscardBg,
        borderColor: colors.statusDiscardBorder,
      };
  }
}
