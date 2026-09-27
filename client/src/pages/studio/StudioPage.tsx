import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuthStore } from '../../stores/authStore';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { Calendar as CalendarIcon, Plus, FileText, CheckCircle2, Clock, Sparkles, Filter, ShieldCheck, Share2 } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#E5A93C',
  AI_GENERATED: '#3D7BFF',
  NEEDS_REVIEW: '#9C27B0',
  CHANGES_REQUESTED: '#FF5722',
  APPROVED: '#B7FF5A',
  SCHEDULED: '#00BCD4',
  PUBLISHED: '#2E7D32',
  ARCHIVED: '#747A75',
};

export default function StudioPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'drafts' | 'calendar' | 'campaigns' | 'analytics' | 'audit'>('drafts');

  const { data: draftsData, isLoading: draftsLoading } = useQuery({
    queryKey: ['studio-drafts'],
    queryFn: () => api.get('/studio/drafts'),
    enabled: !!user,
  });

  const { data: campaignsData } = useQuery({
    queryKey: ['studio-campaigns'],
    queryFn: () => api.get('/studio/campaigns'),
    enabled: !!user,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['studio-analytics'],
    queryFn: () => api.get('/analytics/overview').catch(() => null),
  });

  // Simulated calendar entries
  const CALENDAR_ITEMS = [
    { title: 'Antarctic Firn Core Highlights', platform: 'x', status: 'SCHEDULED', date: '2026-09-28', time: '14:00', campaign: 'Arctic Expedition Awareness' },
    { title: 'Kongsfjorden CTD Ocean Digest', platform: 'newsletter', status: 'APPROVED', date: '2026-09-29', time: '09:30', campaign: 'Marine Ecosystem Briefs' },
    { title: 'Bharati Station Weather Series', platform: 'instagram', status: 'NEEDS_REVIEW', date: '2026-09-30', time: '16:00', campaign: 'Polar Telemetry Week' },
    { title: 'Himalayan Mass Balance Paper Brief', platform: 'linkedin', status: 'PUBLISHED', date: '2026-09-25', time: '11:00', campaign: 'Glacier Monitoring' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-[#FAF9F5] border border-[#0D1211]/15 rounded-2xl p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-[#0D1211] text-[#B7FF5A] rounded-full flex items-center justify-center mx-auto text-xl">🔐</div>
          <h2 className="font-serif text-3xl font-medium text-[#0D1211]">Sign In Required</h2>
          <p className="text-[#747A75] text-sm font-light leading-relaxed">
            ORUVIA Studio is reserved for institutional contributors, editors, and peer reviewers.
          </p>
          <Link href="/login" className="inline-block px-6 py-3 bg-[#0D1211] text-[#B7FF5A] rounded-xl font-mono text-xs uppercase font-semibold hover:bg-[#192220]">
            Sign In with Demo Credentials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col">
      {/* Studio Banner */}
      <div className="bg-[#0D1211] text-[#F4F2EC] pt-24 pb-10 px-6 sm:px-8 border-b border-[#0D1211]/20">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#B7FF5A] animate-pulse" />
                <span className="font-mono text-xs text-[#B7FF5A] uppercase tracking-widest">ORUVIA Institutional Studio</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-normal">Content Studio & Workflow</h1>
              <p className="text-[#747A75] text-sm font-light mt-1">
                Turn verified scientific datasets into multi-platform outreach content with Evidence Lock.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/studio/upload"
                className="px-5 py-2.5 bg-[#B7FF5A] text-[#0D1211] font-mono text-xs uppercase font-semibold rounded-lg hover:bg-lime-400 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Wizard</span>
              </Link>
              <Link
                href="/studio/drafts/new"
                className="px-5 py-2.5 bg-[#192220] border border-[#747A75]/30 text-[#F4F2EC] font-mono text-xs uppercase rounded-lg hover:border-[#F4F2EC] transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-[#3D7BFF]" />
                <span>New Evidence Draft</span>
              </Link>
            </div>
          </div>

          {/* Workflow Stats Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#747A75]/20 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#131B19] border border-[#747A75]/20">
              <span className="text-[#747A75] block text-[10px] uppercase">Active Drafts</span>
              <span className="text-2xl font-bold text-[#F4F2EC]">{draftsData?.drafts?.length || 8}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#131B19] border border-[#747A75]/20">
              <span className="text-[#747A75] block text-[10px] uppercase">Needs Review</span>
              <span className="text-2xl font-bold text-purple-400">3</span>
            </div>
            <div className="p-4 rounded-xl bg-[#131B19] border border-[#747A75]/20">
              <span className="text-[#747A75] block text-[10px] uppercase">Scheduled</span>
              <span className="text-2xl font-bold text-[#00BCD4]">4</span>
            </div>
            <div className="p-4 rounded-xl bg-[#131B19] border border-[#747A75]/20">
              <span className="text-[#747A75] block text-[10px] uppercase">Evidence Lock Rate</span>
              <span className="text-2xl font-bold text-[#B7FF5A]">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#0D1211]/10 bg-[#FAF9F5] sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex gap-2 font-mono text-xs overflow-x-auto scrollbar-none">
          {[
            { id: 'drafts', label: 'Editorial Drafts' },
            { id: 'calendar', label: 'Publishing Calendar' },
            { id: 'campaigns', label: 'Campaigns' },
            { id: 'analytics', label: 'Outreach Analytics' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3.5 px-4 font-semibold border-b-2 transition-colors uppercase whitespace-nowrap ${
                activeTab === t.id ? 'border-[#0D1211] text-[#0D1211]' : 'border-transparent text-[#747A75] hover:text-[#0D1211]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 py-8">
        {/* DRAFTS TAB */}
        {activeTab === 'drafts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-[#747A75]">
              <span>Showing all evidence-grounded content drafts</span>
              <VerificationBadge isDemo={true} />
            </div>

            {draftsLoading ? (
              <div className="py-20 text-center text-xs font-mono text-[#747A75]">Loading studio workspace...</div>
            ) : (
              <div className="space-y-3">
                {(draftsData?.drafts || [
                  { _id: 'd1', title: 'Larsemann Hills Firn Isotope Drill Analysis', status: 'NEEDS_REVIEW', platform: 'website_article', updatedAt: '2026-09-26' },
                  { _id: 'd2', title: 'Kongsfjorden CTD Water Column Summary', status: 'APPROVED', platform: 'newsletter', updatedAt: '2026-09-25' },
                  { _id: 'd3', title: 'Bharati Weather Telemetry Update', status: 'SCHEDULED', platform: 'x', updatedAt: '2026-09-24' },
                ]).map((draft: any) => (
                  <Link
                    key={draft._id}
                    href={`/studio/drafts/${draft._id}`}
                    className="p-5 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 hover:border-[#0D1211] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#747A75]">
                        <span className="uppercase text-[#3D7BFF] font-semibold">{draft.platform}</span>
                        <span>·</span>
                        <span>Updated {draft.updatedAt}</span>
                      </div>
                      <h3 className="font-serif text-xl font-medium text-[#0D1211] group-hover:text-[#3D7BFF] transition-colors">
                        {draft.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase"
                        style={{
                          backgroundColor: (STATUS_COLORS[draft.status] || '#0D1211') + '20',
                          color: STATUS_COLORS[draft.status] || '#0D1211',
                        }}
                      >
                        {draft.status}
                      </span>
                      <span className="text-[#0D1211] font-bold group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PUBLISHING CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#747A75] uppercase">Monthly Editorial Schedule · September 2026</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">INTEGRATIONS: DEMO MODE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {CALENDAR_ITEMS.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] font-semibold uppercase">{item.platform}</span>
                    <span className="text-[#747A75]">{item.date} @ {item.time}</span>
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#0D1211]">{item.title}</h4>
                  <p className="text-xs font-mono text-[#747A75]">Campaign: {item.campaign}</p>
                  <div className="pt-2 border-t border-[#0D1211]/10 flex justify-between items-center font-mono text-xs">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold"
                      style={{
                        backgroundColor: (STATUS_COLORS[item.status] || '#0D1211') + '20',
                        color: STATUS_COLORS[item.status] || '#0D1211',
                      }}
                    >
                      {item.status}
                    </span>
                    <span className="text-[#3D7BFF] cursor-pointer hover:underline">Reschedule</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] font-semibold">ACTIVE CAMPAIGN</span>
                <span className="text-[#747A75]">Sept 20 - Oct 05, 2026</span>
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#0D1211]">Arctic Expedition Awareness Week</h3>
              <p className="text-sm text-[#747A75] font-light">
                Coordinated outreach releasing 5 stories, 12 social posts, and 1 scientific newsletter summarizing Ny-Ålesund fjord observations.
              </p>
              <div className="w-full bg-[#EBE8DF] rounded-full h-2 overflow-hidden">
                <div className="bg-[#3D7BFF] h-full w-3/4" />
              </div>
              <div className="flex justify-between font-mono text-xs text-[#747A75]">
                <span>Progress: 75% Complete (9 / 12 Assets Approved)</span>
                <span className="text-[#2E7D32]">Status: On Track</span>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="p-8 rounded-2xl bg-[#0D1211] text-[#F4F2EC] space-y-6">
              <span className="font-mono text-xs text-[#B7FF5A] uppercase tracking-widest block">Signature Metric: Knowledge → Outreach</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <span className="font-serif text-4xl font-normal text-[#F4F2EC] block">8</span>
                  <span className="font-mono text-xs text-[#747A75] uppercase">Expeditions Indexed</span>
                </div>
                <div>
                  <span className="font-serif text-4xl font-normal text-[#3D7BFF] block">15</span>
                  <span className="font-mono text-xs text-[#747A75] uppercase">Datasets Visualized</span>
                </div>
                <div>
                  <span className="font-serif text-4xl font-normal text-[#B7FF5A] block">6</span>
                  <span className="font-mono text-xs text-[#747A75] uppercase">Stories Produced</span>
                </div>
                <div>
                  <span className="font-serif text-4xl font-normal text-purple-400 block">26</span>
                  <span className="font-mono text-xs text-[#747A75] uppercase">Social Assets Generated</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
