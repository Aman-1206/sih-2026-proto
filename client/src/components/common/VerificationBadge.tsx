import React from 'react';
import { VerificationStatus } from '@oruvia/shared';
import { CheckCircle2, ShieldAlert, Database, PlugZap } from 'lucide-react';

interface VerificationBadgeProps {
  status?: VerificationStatus | 'DEMO' | 'NOT_CONNECTED' | 'NOT_CONFIGURED';
  isDemo?: boolean;
  className?: string;
  showIcon?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status = 'DEMO',
  isDemo,
  className = '',
  showIcon = true,
}) => {
  const actualStatus = isDemo ? 'DEMO' : status;

  switch (actualStatus) {
    case 'VERIFIED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#B7FF5A]/15 text-[#2c5302] border border-[#B7FF5A]/40 ${className}`}
          title="Verified source-backed scientific record"
        >
          {showIcon && <CheckCircle2 className="w-3 h-3 text-[#3a6e02]" />}
          VERIFIED
        </span>
      );

    case 'UNVERIFIED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-800 border border-amber-500/30 ${className}`}
          title="Unverified scientific record"
        >
          {showIcon && <ShieldAlert className="w-3 h-3 text-amber-600" />}
          UNVERIFIED
        </span>
      );

    case 'NOT_CONNECTED':
    case 'NOT_CONFIGURED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-neutral-200/60 text-neutral-700 border border-neutral-300 ${className}`}
          title="Integration not connected"
        >
          {showIcon && <PlugZap className="w-3 h-3 text-neutral-500" />}
          NOT CONNECTED
        </span>
      );

    case 'DEMO':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-neutral-100 text-neutral-600 border border-neutral-200 ${className}`}
          title="Illustrative scientific demo record"
        >
          {showIcon && <Database className="w-3 h-3 text-neutral-400" />}
          DEMO RECORD
        </span>
      );
  }
};
