import React, { useState } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Sparkles,
  RefreshCw,
  FileCheck,
  Send,
  Save,
  Check,
  Languages,
  BookOpen,
} from 'lucide-react';
import { IContentDraft, IEvidenceSentence, EvidenceLockStatus, SocialPlatform } from '@oruvia/shared';
import { EvidenceLockInspector } from './EvidenceLockInspector';
import { EvidenceLockBadge } from '../common/EvidenceLockBadge';
import { api } from '../../services/api';

interface TipTapContentEditorProps {
  draft: IContentDraft;
  onSave: (updated: Partial<IContentDraft>) => Promise<void>;
  onSubmitReview: () => Promise<void>;
}

export const TipTapContentEditor: React.FC<TipTapContentEditorProps> = ({
  draft,
  onSave,
  onSubmitReview,
}) => {
  const [content, setContent] = useState(draft.content || '');
  const [title, setTitle] = useState(draft.title || '');
  const [evidenceSentences, setEvidenceSentences] = useState<IEvidenceSentence[]>(draft.evidenceSentences || []);
  const [evidenceSummary, setEvidenceSummary] = useState(draft.evidenceSummary || {
    totalSentences: 0,
    supportedCount: 0,
    editorVerifiedCount: 0,
    editorialCount: 0,
    unverifiedCount: 0,
    isLockedForApproval: false,
  });

  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle sentence status change in Evidence Lock
  const handleSentenceStatusChange = (sentenceId: string, newStatus: EvidenceLockStatus) => {
    const updated = evidenceSentences.map((s) =>
      s.sentenceId === sentenceId ? { ...s, status: newStatus } : s
    );
    setEvidenceSentences(updated);

    const supportedCount = updated.filter((s) => s.status === 'SUPPORTED').length;
    const editorVerifiedCount = updated.filter((s) => s.status === 'EDITOR_VERIFIED').length;
    const editorialCount = updated.filter((s) => s.status === 'EDITORIAL').length;
    const unverifiedCount = updated.filter((s) => s.status === 'UNVERIFIED').length;

    setEvidenceSummary({
      totalSentences: updated.length,
      supportedCount,
      editorVerifiedCount,
      editorialCount,
      unverifiedCount,
      isLockedForApproval: unverifiedCount > 0,
    });
  };

  const handleAiAction = async (action: 'shorten' | 'expand' | 'headline' | 'hashtags' | 'translate') => {
    setIsAiLoading(true);
    try {
      if (action === 'shorten') {
        const shortened = content.split('\n\n').slice(0, 2).join('\n\n');
        setAiSuggestion(shortened);
      } else if (action === 'expand') {
        const expanded = content + '\n\nAdditionally, multi-year observation arrays confirm that these boundary anomalies persist through transitional seasonal thresholds.';
        setAiSuggestion(expanded);
      } else if (action === 'headline') {
        setTitle(`Scientific Breakthrough: ${draft.platform.toUpperCase()} Dispatch`);
      } else if (action === 'hashtags') {
        const { tags } = await api.ai.suggestTags(content);
        setAiSuggestion(content + '\n\n' + tags.map((t) => `#${t.replace(/\s+/g, '')}`).join(' '));
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAcceptAiSuggestion = () => {
    if (aiSuggestion) {
      setContent(aiSuggestion);
      setAiSuggestion(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        title,
        content,
        evidenceSentences,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT / CENTER: Source Panel & Editor */}
      <div className="lg:col-span-8 space-y-6">
        {/* Top Title & Metadata Bar */}
        <div className="p-4 bg-[#FAF9F5] border border-[#0D1211]/15 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#0D1211] text-[#F4F2EC] font-semibold">
                {draft.platform.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-[#747A75]">
                Audience: <strong className="text-[#0D1211]">{draft.audience}</strong> · Tone: <strong className="text-[#0D1211]">{draft.tone}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-lg border border-[#0D1211]/20 text-xs font-mono flex items-center gap-1.5 hover:bg-[#EBE8DF] transition-colors"
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Save className="w-3.5 h-3.5" />}
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save Draft'}
              </button>

              <button
                onClick={onSubmitReview}
                disabled={evidenceSummary.isLockedForApproval}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 font-semibold transition-all ${
                  evidenceSummary.isLockedForApproval
                    ? 'bg-[#EBE8DF] text-[#747A75] cursor-not-allowed'
                    : 'bg-[#0D1211] text-[#B7FF5A] hover:bg-[#192220] shadow-md'
                }`}
                title={evidenceSummary.isLockedForApproval ? 'Resolve unverified claims before submitting' : 'Submit for Review'}
              >
                <Send className="w-3.5 h-3.5" />
                Submit for Review
              </button>
            </div>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Draft headline or post title..."
            className="w-full font-serif text-2xl sm:text-3xl text-[#0D1211] bg-transparent border-b border-transparent hover:border-[#0D1211]/20 focus:border-[#0D1211] focus:outline-none pb-1"
          />
        </div>

        {/* Editor Toolbar */}
        <div className="border border-[#0D1211]/15 rounded-xl bg-[#FAF9F5] overflow-hidden">
          <div className="p-2.5 bg-[#F4F2EC] border-b border-[#0D1211]/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            {/* AI Assistant Tools */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#747A75] uppercase mr-1">AI Assistant:</span>
              <button
                onClick={() => handleAiAction('shorten')}
                disabled={isAiLoading}
                className="px-2 py-1 rounded bg-[#FAF9F5] border border-[#0D1211]/10 hover:bg-[#0D1211] hover:text-[#F4F2EC] transition-colors"
              >
                Shorten
              </button>
              <button
                onClick={() => handleAiAction('expand')}
                disabled={isAiLoading}
                className="px-2 py-1 rounded bg-[#FAF9F5] border border-[#0D1211]/10 hover:bg-[#0D1211] hover:text-[#F4F2EC] transition-colors"
              >
                Expand
              </button>
              <button
                onClick={() => handleAiAction('hashtags')}
                disabled={isAiLoading}
                className="px-2 py-1 rounded bg-[#FAF9F5] border border-[#0D1211]/10 hover:bg-[#0D1211] hover:text-[#F4F2EC] transition-colors"
              >
                Suggest Tags
              </button>
            </div>

            <div className="text-[11px] text-[#747A75]">
              {content.split(/\s+/).filter(Boolean).length} words · {content.length} chars
            </div>
          </div>

          {/* AI Suggestion Diff Box (Required: AI edits must NOT overwrite content instantly, show suggestion & accept) */}
          {aiSuggestion && (
            <div className="p-4 bg-[#B7FF5A]/15 border-b border-[#7bc418]/40 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-mono text-[#0D1211]">
                <span className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" /> AI Proposed Suggestion
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleAcceptAiSuggestion}
                    className="px-3 py-1 bg-[#0D1211] text-[#B7FF5A] rounded font-mono text-xs hover:bg-[#192220]"
                  >
                    Accept & Apply Diff
                  </button>
                  <button
                    onClick={() => setAiSuggestion(null)}
                    className="px-2 py-1 bg-[#EBE8DF] text-[#0D1211] rounded font-mono text-xs hover:bg-[#D8D4C8]"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <p className="text-xs font-mono text-[#0D1211] whitespace-pre-wrap bg-white/70 p-3 rounded border border-[#7bc418]/30">
                {aiSuggestion}
              </p>
            </div>
          )}

          {/* Text Area / Editor Body */}
          <div className="p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full bg-transparent font-sans text-sm sm:text-base leading-relaxed text-[#0D1211] focus:outline-none resize-none"
              placeholder="Write or refine scientific outreach content..."
            />
          </div>

          {/* Interactive Evidence Lock Sentence Highlights Preview */}
          <div className="p-6 border-t border-[#0D1211]/10 bg-[#F4F2EC]/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75]">
                Live Evidence Lock View
              </span>
              <span className="text-[10px] font-mono text-[#747A75]">
                Hover/Click sentences to inspect source citations
              </span>
            </div>
            <div className="text-sm leading-loose p-4 rounded-lg bg-[#FAF9F5] border border-[#0D1211]/10">
              {evidenceSentences.map((s) => (
                <EvidenceLockBadge
                  key={s.sentenceId}
                  sentence={s}
                  canEdit={true}
                  onStatusChange={(status) => handleSentenceStatusChange(s.sentenceId, status)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Evidence Lock Inspector & Review Comments */}
      <div className="lg:col-span-4 space-y-6">
        <EvidenceLockInspector
          evidenceSentences={evidenceSentences}
          evidenceSummary={evidenceSummary}
          onSentenceStatusChange={handleSentenceStatusChange}
        />

        {/* Review Comments if any */}
        {draft.reviewComments && draft.reviewComments.length > 0 && (
          <div className="p-4 bg-[#FAF9F5] border border-[#0D1211]/15 rounded-xl space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] block">
              Reviewer Notes
            </span>
            <div className="space-y-2">
              {draft.reviewComments.map((c, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#F4F2EC] border border-[#0D1211]/10 text-xs">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#747A75]">
                    <span className="font-semibold text-[#0D1211]">{c.userName}</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 text-[#0D1211]">{c.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
