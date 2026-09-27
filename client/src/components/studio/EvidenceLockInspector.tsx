import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileEdit, ExternalLink, Lock, Unlock } from 'lucide-react';
import { IEvidenceSentence, EvidenceLockStatus } from '@oruvia/shared';

interface EvidenceLockInspectorProps {
  evidenceSentences: IEvidenceSentence[];
  evidenceSummary: {
    totalSentences: number;
    supportedCount: number;
    editorVerifiedCount: number;
    editorialCount: number;
    unverifiedCount: number;
    isLockedForApproval: boolean;
  };
  onSentenceStatusChange: (sentenceId: string, newStatus: EvidenceLockStatus) => void;
}

export const EvidenceLockInspector: React.FC<EvidenceLockInspectorProps> = ({
  evidenceSentences,
  evidenceSummary,
  onSentenceStatusChange,
}) => {
  return (
    <div className="bg-[#FAF9F5] border border-[#0D1211]/15 rounded-xl p-4 space-y-4 text-[#0D1211]">
      {/* Header & Lock Status */}
      <div className="pb-3 border-b border-[#0D1211]/10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75]">
            Evidence Lock Engine
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {evidenceSummary.isLockedForApproval ? (
              <span className="inline-flex items-center gap-1 text-[#F25F5C] font-semibold bg-[#F25F5C]/10 px-2 py-0.5 rounded border border-[#F25F5C]/20">
                <Lock className="w-3 h-3" /> LOCKED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#2E7D32] font-semibold bg-[#B7FF5A]/30 px-2 py-0.5 rounded border border-[#7bc418]/40">
                <Unlock className="w-3 h-3" /> READY FOR REVIEW
              </span>
            )}
          </div>
        </div>
        <h4 className="font-serif text-lg font-medium mt-1">Factual Provenance</h4>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
        <div className="p-2 rounded-lg bg-[#B7FF5A]/20 border border-[#B7FF5A]/40">
          <span className="text-lg font-bold text-[#0D1211]">{evidenceSummary.supportedCount}</span>
          <span className="block text-[10px] text-[#747A75] uppercase">Supported</span>
        </div>
        <div className="p-2 rounded-lg bg-[#3D7BFF]/15 border border-[#3D7BFF]/30">
          <span className="text-lg font-bold text-[#0D1211]">{evidenceSummary.editorVerifiedCount}</span>
          <span className="block text-[10px] text-[#747A75] uppercase">Verified</span>
        </div>
        <div className="p-2 rounded-lg bg-[#EBE8DF]">
          <span className="text-lg font-bold text-[#0D1211]">{evidenceSummary.editorialCount}</span>
          <span className="block text-[10px] text-[#747A75] uppercase">Editorial</span>
        </div>
        <div className={`p-2 rounded-lg ${evidenceSummary.unverifiedCount > 0 ? 'bg-[#F25F5C]/20 border border-[#F25F5C]/40 text-[#F25F5C]' : 'bg-[#EBE8DF]'}`}>
          <span className="text-lg font-bold">{evidenceSummary.unverifiedCount}</span>
          <span className="block text-[10px] uppercase">Unverified</span>
        </div>
      </div>

      {/* Lock Warning Banner */}
      {evidenceSummary.isLockedForApproval && (
        <div className="p-3 bg-[#F25F5C]/10 border border-[#F25F5C]/30 rounded-lg text-xs text-[#F25F5C] flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Approval Blocked:</strong> Unverified scientific claims must be resolved or validated before submitting to reviewers.
          </p>
        </div>
      )}

      {/* Sentence Provenance Item List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] block">
          Sentence-by-Sentence Breakdown
        </span>

        {evidenceSentences.map((s, idx) => (
          <div
            key={s.sentenceId || idx}
            className={`p-3 rounded-lg border text-xs space-y-2 ${
              s.status === 'SUPPORTED'
                ? 'bg-[#B7FF5A]/10 border-[#7bc418]/30'
                : s.status === 'EDITOR_VERIFIED'
                ? 'bg-[#3D7BFF]/10 border-[#3D7BFF]/30'
                : s.status === 'EDITORIAL'
                ? 'bg-[#F4F2EC] border-[#0D1211]/10'
                : 'bg-[#F25F5C]/10 border-[#F25F5C]/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#747A75]">Sentence #{idx + 1}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-semibold ${
                  s.status === 'SUPPORTED'
                    ? 'bg-[#B7FF5A] text-[#0D1211]'
                    : s.status === 'EDITOR_VERIFIED'
                    ? 'bg-[#3D7BFF] text-white'
                    : s.status === 'EDITORIAL'
                    ? 'bg-[#EBE8DF] text-[#747A75]'
                    : 'bg-[#F25F5C] text-white'
                }`}
              >
                {s.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-[#0D1211] font-medium leading-relaxed">{s.text}</p>

            {s.sourceCitation && (
              <div className="text-[11px] text-[#747A75] bg-white/60 p-2 rounded border border-[#0D1211]/5 space-y-1">
                <span className="font-mono text-[9px] block text-[#0D1211]">
                  Source: {s.sourceCitation.resourceTitle}
                </span>
                {s.sourceCitation.exactQuoteOrData && (
                  <p className="italic text-[10px]">"{s.sourceCitation.exactQuoteOrData}"</p>
                )}
                <span className="text-[9px] font-mono text-[#3D7BFF] block">
                  Confidence Score: {Math.round(s.sourceCitation.confidenceScore * 100)}%
                </span>
              </div>
            )}

            {/* Quick resolution actions */}
            <div className="flex gap-1 justify-end pt-1">
              {s.status !== 'EDITOR_VERIFIED' && (
                <button
                  onClick={() => onSentenceStatusChange(s.sentenceId, 'EDITOR_VERIFIED')}
                  className="px-2 py-0.5 rounded bg-[#3D7BFF] text-white text-[10px] font-mono hover:bg-blue-600"
                >
                  Verify
                </button>
              )}
              {s.status !== 'EDITORIAL' && (
                <button
                  onClick={() => onSentenceStatusChange(s.sentenceId, 'EDITORIAL')}
                  className="px-2 py-0.5 rounded bg-[#EBE8DF] text-[#0D1211] text-[10px] font-mono hover:bg-[#D8D4C8]"
                >
                  Mark Editorial
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
