import React, { useState } from 'react';
import { Link } from 'wouter';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { Sparkles, Compass, Database, FileText, Globe, ArrowRight, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

interface AskQueryResult {
  question: string;
  answer: string;
  hasSufficientEvidence: boolean;
  confidenceScore: number;
  sources: Array<{
    resourceId: string;
    resourceType: string;
    title: string;
    slug?: string;
    doi?: string;
    snippet: string;
    pageNumber?: number;
    relevanceScore: number;
  }>;
  relatedDatasets?: Array<{ id: string; title: string; slug: string; doi?: string }>;
  relatedPublications?: Array<{ id: string; title: string; slug: string; doi?: string; year?: number }>;
  relatedExpeditions?: Array<{ id: string; name: string; slug: string; region: string }>;
  relatedMedia?: Array<{ id: string; title: string; url: string; mediaType: string }>;
}

const EXAMPLE_RESEARCH_QUERIES = [
  'Show datasets collected near Maitri Station in Dronning Maud Land',
  'Explain Antarctic ice-core isotope stratigraphy for a high school student',
  'Which peer-reviewed publications are linked to the 43rd Antarctic Expedition?',
  'What CTD salinity casts exist for Kongsfjorden at 79°N in Svalbard?',
  'What is the observed surface melting rate at Larsemann Hills?',
];

export default function AskOruviaPage() {
  const [queryInput, setQueryInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState<AskQueryResult | null>(null);

  const executeAskQuery = async (questionText: string) => {
    if (!questionText.trim() || isQuerying) return;
    setQueryInput(questionText);
    setIsQuerying(true);

    try {
      const response = await api.ai.ask(questionText);
      setQueryResult(response);
    } catch (err) {
      console.error('Ask ORUVIA query failed:', err);
      setQueryResult({
        question: questionText,
        answer: 'I couldn’t find sufficient evidence in the indexed repository to answer that reliably.',
        hasSufficientEvidence: false,
        confidenceScore: 0,
        sources: [],
        relatedDatasets: [],
        relatedPublications: [],
        relatedExpeditions: [],
        relatedMedia: [],
      });
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 pb-12 px-6 sm:px-8 border-b border-[#0D1211]/10 bg-[#FAF9F5]">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1211] text-[#B7FF5A] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EVIDENCE-GROUNDED SCIENTIFIC DISCOVERY</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#0D1211] tracking-tight">
            Ask ORUVIA
          </h1>
          <p className="text-base sm:text-xl text-[#747A75] font-light max-w-2xl leading-relaxed">
            Query indexed field expeditions, sensor telemetry, DOIs, and publications. Answers are strictly grounded in repository material with direct citation provenance.
          </p>

          {/* Research Query Input Box */}
          <div className="p-2 rounded-2xl bg-[#F4F2EC] border border-[#0D1211]/20 shadow-sm flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeAskQuery(queryInput)}
              placeholder="Ask a scientific research question..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-[#0D1211] placeholder:text-[#747A75] focus:outline-none font-mono"
            />
            <button
              onClick={() => executeAskQuery(queryInput)}
              disabled={!queryInput.trim() || isQuerying}
              className="px-6 py-3 rounded-xl bg-[#0D1211] text-[#B7FF5A] font-mono text-xs uppercase font-semibold hover:bg-[#192220] transition-colors shrink-0 disabled:opacity-40"
            >
              {isQuerying ? 'Querying Repository...' : 'Ask ORUVIA →'}
            </button>
          </div>

          {/* Example Queries */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono text-[#747A75] uppercase block">Example Research Queries:</span>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_RESEARCH_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => executeAskQuery(q)}
                  className="px-3 py-1.5 rounded-lg bg-[#F4F2EC] hover:bg-[#EBE8DF] border border-[#0D1211]/10 text-xs font-mono text-[#0D1211] text-left transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Scientific Discovery Results Area */}
      <main className="flex-1 py-12 px-6 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {isQuerying && (
            <div className="p-12 text-center rounded-2xl border border-[#0D1211]/15 bg-[#FAF9F5] space-y-4">
              <div className="w-10 h-10 border-2 border-[#0D1211] border-t-[#B7FF5A] rounded-full animate-spin mx-auto" />
              <p className="font-mono text-xs uppercase tracking-widest text-[#747A75]">
                Scanning Vector Index & Provenance Links...
              </p>
            </div>
          )}

          {!isQuerying && queryResult && (
            <div className="space-y-8 animate-fadeIn">
              {/* Question Header */}
              <div className="p-4 rounded-xl bg-[#0D1211] text-[#F4F2EC] flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[#747A75] block text-[10px] uppercase">Scientific Query</span>
                  <span className="text-base text-[#F4F2EC] font-sans font-medium">{queryResult.question}</span>
                </div>
                <VerificationBadge isDemo={true} />
              </div>

              {/* Answer Box */}
              <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#0D1211]/10">
                  <div className="flex items-center gap-2">
                    {queryResult.hasSufficientEvidence ? (
                      <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    )}
                    <span className="font-mono text-xs font-semibold text-[#0D1211] uppercase tracking-wider">
                      {queryResult.hasSufficientEvidence ? 'Grounded Scientific Answer' : 'Insufficient Evidence Notice'}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#747A75]">
                    Confidence: {Math.round((queryResult.confidenceScore || 0.95) * 100)}%
                  </span>
                </div>

                <div className="prose prose-slate max-w-none text-base leading-relaxed text-[#0D1211] font-light">
                  {queryResult.answer}
                </div>
              </div>

              {/* Source Evidence Section */}
              {queryResult.sources && queryResult.sources.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#747A75] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#3D7BFF]" />
                    Source Evidence & Citations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {queryResult.sources.map((src, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="px-2 py-0.5 rounded bg-[#3D7BFF]/10 text-[#3D7BFF] uppercase font-semibold text-[10px]">
                            [{src.resourceType} {src.pageNumber ? `· Page ${src.pageNumber}` : ''}]
                          </span>
                          <span className="text-[#747A75]">Score: {Math.round(src.relevanceScore * 100)}%</span>
                        </div>
                        <h4 className="font-serif text-lg font-medium text-[#0D1211]">{src.title}</h4>
                        <p className="text-xs text-[#747A75] italic font-mono bg-[#F4F2EC] p-2 rounded border border-[#0D1211]/5">
                          "{src.snippet}"
                        </p>
                        {src.slug && (
                          <Link
                            href={`/${src.resourceType}s/${src.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-mono text-[#3D7BFF] hover:underline pt-1"
                          >
                            <span>Inspect Source Document</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Resources Quad Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-[#0D1211]/10">
                {/* Related Datasets */}
                <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#0D1211] font-semibold">
                    <Database className="w-4 h-4 text-[#3D7BFF]" />
                    <span>Related Datasets</span>
                  </div>
                  {queryResult.relatedDatasets && queryResult.relatedDatasets.length > 0 ? (
                    <ul className="space-y-2 text-xs font-mono">
                      {queryResult.relatedDatasets.map((d) => (
                        <li key={d.id}>
                          <Link href={`/datasets/${d.slug}`} className="text-[#0D1211] hover:text-[#3D7BFF] block truncate">
                            • {d.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#747A75] italic font-mono">No direct dataset matches</p>
                  )}
                </div>

                {/* Related Publications */}
                <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#0D1211] font-semibold">
                    <FileText className="w-4 h-4 text-[#0D1211]" />
                    <span>Related Papers</span>
                  </div>
                  {queryResult.relatedPublications && queryResult.relatedPublications.length > 0 ? (
                    <ul className="space-y-2 text-xs font-mono">
                      {queryResult.relatedPublications.map((p) => (
                        <li key={p.id}>
                          <Link href={`/publications/${p.slug}`} className="text-[#0D1211] hover:text-[#3D7BFF] block truncate">
                            • {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#747A75] italic font-mono">No direct publication matches</p>
                  )}
                </div>

                {/* Related Expeditions */}
                <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#0D1211] font-semibold">
                    <Compass className="w-4 h-4 text-[#2E7D32]" />
                    <span>Related Expeditions</span>
                  </div>
                  {queryResult.relatedExpeditions && queryResult.relatedExpeditions.length > 0 ? (
                    <ul className="space-y-2 text-xs font-mono">
                      {queryResult.relatedExpeditions.map((e) => (
                        <li key={e.id}>
                          <Link href={`/expeditions/${e.slug}`} className="text-[#0D1211] hover:text-[#3D7BFF] block truncate">
                            • {e.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#747A75] italic font-mono">No direct expedition matches</p>
                  )}
                </div>

                {/* Explore on Atlas Button */}
                <div className="p-5 rounded-xl bg-[#0D1211] text-[#F4F2EC] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#B7FF5A] font-semibold">
                      <Globe className="w-4 h-4" />
                      <span>Spatial Mapping</span>
                    </div>
                    <p className="text-xs text-[#747A75] pt-2 font-mono">
                      Visualize coordinate layers & station telemetry linked to this query.
                    </p>
                  </div>
                  <Link
                    href="/atlas"
                    className="w-full py-2.5 bg-[#B7FF5A] text-[#0D1211] text-center rounded font-mono text-xs uppercase font-semibold hover:bg-lime-400 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Explore on Atlas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
