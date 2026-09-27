import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileEdit, ExternalLink } from 'lucide-react';
import { EvidenceLockStatus, IEvidenceSentence } from '@oruvia/shared';
import { Link } from 'wouter';

interface EvidenceLockBadgeProps {
  sentence: IEvidenceSentence;
  onStatusChange?: (newStatus: EvidenceLockStatus) => void;
  canEdit?: boolean;
}

export const EvidenceLockBadge: React.FC<EvidenceLockBadgeProps> = ({
  sentence,
  onStatusChange,
  canEdit = false,
}) => {
  const [showPopover, setShowPopover] = useState(false);

  const getBadgeStyle = () => {
    switch (sentence.status) {
      case 'SUPPORTED':
        return 'evidence-supported text-[#0D1211]';
      case 'EDITOR_VERIFIED':
        return 'evidence-editor-verified text-[#0D1211]';
      case 'EDITORIAL':
        return 'evidence-editorial text-[#0D1211]';
      case 'UNVERIFIED':
        return 'evidence-unverified text-[#F25F5C]';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (sentence.status) {
      case 'SUPPORTED':
        return <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32] inline mr-1" />;
      case 'EDITOR_VERIFIED':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7BFF] inline mr-1" />;
      case 'EDITORIAL':
        return <FileEdit className="w-3.5 h-3.5 text-[#747A75] inline mr-1" />;
      case 'UNVERIFIED':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#F25F5C] inline mr-1" />;
    }
  };

  return (
    <span className="relative inline-block group">
      <span
        onClick={() => setShowPopover(!showPopover)}
        className={`${getBadgeStyle()} cursor-pointer select-text`}
        title={`Evidence Lock: ${sentence.status}. Click to inspect provenance.`}
      >
        {sentence.text}{' '}
      </span>

      {/* Provenance Inspection Popover */}
      {showPopover && (
        <div
          className="absolute z-50 bottom-full left-0 mb-2 w-80 p-3 bg-[#FAF9F5] border border-[#0D1211]/20 rounded-lg shadow-2xl text-left font-sans text-xs text-[#0D1211]"
          onMouseLeave={() => setShowPopover(false)}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#0D1211]/10">
            <span className="font-mono uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
              {getStatusIcon()}
              Evidence Lock: {sentence.status.replace('_', ' ')}
            </span>
            <button
              onClick={() => setShowPopover(false)}
              className="text-[#747A75] hover:text-[#0D1211] text-xs font-mono"
            >
              ✕
            </button>
          </div>

          <div className="py-2 space-y-2">
            {sentence.sourceCitation ? (
              <div>
                <span className="text-[10px] font-mono text-[#747A75] block">Referenced Provenance:</span>
                <p className="font-medium text-xs mt-0.5">{sentence.sourceCitation.resourceTitle}</p>
                {sentence.sourceCitation.exactQuoteOrData && (
                  <p className="text-[11px] text-[#747A75] italic mt-1 bg-[#F4F2EC] p-1.5 rounded border border-[#0D1211]/5">
                    "{sentence.sourceCitation.exactQuoteOrData}"
                  </p>
                )}
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#0D1211]/10 text-[10px] font-mono">
                  <span>Confidence: {Math.round(sentence.sourceCitation.confidenceScore * 100)}%</span>
                  {sentence.sourceCitation.resourceId && (
                    <Link
                      href={`/${sentence.sourceCitation.resourceType}s/${sentence.sourceCitation.resourceId}`}
                      className="text-[#3D7BFF] hover:underline flex items-center gap-1"
                    >
                      View Source <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-[#747A75]">
                {sentence.status === 'EDITORIAL'
                  ? 'Categorized as general editorial narrative or transition framing.'
                  : 'No direct repository source matched. Requires editor verification before final publication approval.'}
              </p>
            )}

            {sentence.editorNotes && (
              <div className="pt-2 border-t border-[#0D1211]/10">
                <span className="text-[10px] font-mono text-[#747A75] block">Editor Notes:</span>
                <p className="text-[11px] text-[#0D1211]">{sentence.editorNotes}</p>
              </div>
            )}
          </div>

          {canEdit && onStatusChange && (
            <div className="pt-2 border-t border-[#0D1211]/10 flex gap-1 justify-end">
              <button
                onClick={() => onStatusChange('EDITOR_VERIFIED')}
                className="px-2 py-1 bg-[#3D7BFF] text-white rounded text-[10px] font-mono hover:bg-blue-600"
              >
                Mark Verified
              </button>
              <button
                onClick={() => onStatusChange('EDITORIAL')}
                className="px-2 py-1 bg-[#EBE8DF] text-[#0D1211] rounded text-[10px] font-mono hover:bg-[#D8D4C8]"
              >
                Mark Editorial
              </button>
            </div>
          )}
        </div>
      )}
    </span>
  );
};
