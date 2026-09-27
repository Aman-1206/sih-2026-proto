import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { TipTapContentEditor } from '../../components/studio/TipTapContentEditor';
import { IContentDraft } from '@oruvia/shared';

const STATUS_COLORS: Record<string, string> = {
  draft: '#FFD93D',
  review: '#3D7BFF',
  approved: '#B7FF5A',
  published: '#2ECC71',
  rejected: '#FF6B6B',
};

interface Props {
  draftId?: string;
}

export default function StudioDraftPage({ draftId }: Props) {
  const { user } = useAuthStore();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['draft', draftId],
    queryFn: () => api.studio.getDraftById(draftId!),
    enabled: !!draftId && draftId !== 'new',
  });

  const draft = data?.draft as IContentDraft | undefined;

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<IContentDraft>) =>
      api.studio.updateDraft(draftId!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draft', draftId] });
      queryClient.invalidateQueries({ queryKey: ['studio-drafts'] });
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => api.studio.submitForReview(draftId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draft', draftId] });
      queryClient.invalidateQueries({ queryKey: ['studio-drafts'] });
    },
  });

  const handleSave = async (updated: Partial<IContentDraft>) => {
    await updateMutation.mutateAsync(updated);
  };

  const handleSubmitReview = async () => {
    await submitMutation.mutateAsync();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl mb-2">Sign in required</h2>
          <button
            onClick={() => setLocation('/login')}
            className="text-[#3D7BFF] hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0D1211] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EC]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E8E4DC] sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/studio" className="text-[#747A75] hover:text-[#0D1211] transition-colors font-mono text-xs">
              ← Studio
            </Link>
            <span className="text-[#E8E4DC]">/</span>
            <span className="text-sm text-[#0D1211] font-medium truncate max-w-xs">
              {draft?.title || 'Untitled Draft'}
            </span>
            {draft?.status && (
              <span
                className="px-2.5 py-0.5 text-xs font-mono rounded-full"
                style={{
                  backgroundColor: (STATUS_COLORS[draft.status] || '#E8E4DC') + '20',
                  color: STATUS_COLORS[draft.status] || '#747A75',
                }}
              >
                {draft.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {draft ? (
          <TipTapContentEditor
            draft={draft}
            onSave={handleSave}
            onSubmitReview={handleSubmitReview}
          />
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="font-serif text-2xl mb-2">Draft not found</h3>
            <Link href="/studio" className="text-[#3D7BFF] hover:underline">
              Back to Studio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
