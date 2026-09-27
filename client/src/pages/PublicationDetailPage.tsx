import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import {
  FileText,
  Copy,
  Check,
  ExternalLink,
  Database,
  MapPin,
  Calendar,
  Share2,
  BookOpen,
  GraduationCap,
  Sparkles,
  Download,
  List,
  ArrowUpRight,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CitationModal } from '../components/common/CitationModal';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { api } from '../services/api';
import { IPublication, IDataset, IExpedition } from '@oruvia/shared';

type ReadingMode = 'QUICK' | 'STUDENT' | 'GENERAL' | 'RESEARCH';

export const PublicationDetailPage: React.FC = () => {
  const [, params] = useRoute('/publications/:slug');
  const slug = params?.slug || '';

  const [publication, setPublication] = useState<IPublication | null>(null);
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  const [expeditions, setExpeditions] = useState<IExpedition[]>([]);
  const [bibtex, setBibtex] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [readingMode, setReadingMode] = useState<ReadingMode>('RESEARCH');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.publications.getBySlug(slug)
      .then((data) => {
        setPublication(data.publication);
        setDatasets(data.datasets || []);
        setExpeditions(data.expeditions || []);
        setBibtex(data.bibtex || '');
      })
      .catch((err) => console.error('Failed to load publication detail:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center font-mono text-xs text-[#747A75]">
        Loading scientific paper and multi-mode reading text...
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex flex-col justify-between">
        <Navbar />
        <main className="max-w-4xl mx-auto py-32 px-6 text-center space-y-4">
          <h1 className="font-serif text-3xl">Publication Not Found</h1>
          <Link href="/publications" className="px-4 py-2 bg-[#0D1211] text-[#F4F2EC] rounded font-mono text-xs uppercase inline-block">
            Back to Publications
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Fallback enriched paper text if fullText is partial
  const fullText = publication.fullText || {
    introduction: `Polar firn and glacial ice sheets represent Earth's most pristine atmospheric laboratories. Over hundreds of millennia, precipitation accumulating over high-latitude interiors preserves ambient gas samples in sealed bubbles, alongside isotopic signatures of past evaporation and condensation dynamics. Understanding ice core isotope stratigraphy in East Antarctica (specifically the Larsemann Hills oasis) is vital to establishing baseline pre-industrial atmospheric parameters and evaluating modern polar mass balance trends.`,
    background: `The 43rd Scientific Expedition to Antarctica conducted extensive core drilling across the Princess Elizabeth Land sector. Samples recovered from deep ice columns provide unprecedented temporal resolution for paleoclimate reconstructions dating back over 120,000 years BP.`,
    methodology: `Ice core sections were extracted using a specialized electromechanical dry-core drill. High-resolution cavity ring-down spectroscopy (CRDS) was employed to measure continuous δ18O and δD isotopic ratios. Bubble gas extraction was performed via cryogenic vacuum extraction coupled to gas chromatography mass spectrometry for CO2 and CH4 determination.`,
    studyArea: `Larsemann Hills, Prydz Bay coast, East Antarctica (76.2°S, 76.1°E). Average elevation: 42 meters above sea level. Mean annual temperature: -10.4°C.`,
    instrumentation: `Picarro L2130-i Isotopic Water Analyzer, Thermo Scientific MAT 253 Stable Isotope Ratio Mass Spectrometer, DGPS elevation receivers.`,
    results: `Core depth profiles reveal distinct glacial-interglacial transitions. Interglacial periods demonstrate enriched δ18O values ranging from -32.5‰ to -34.0‰, correlating with CO2 concentrations of 275–285 ppm. Conversely, glacial peak depths show depleted isotopic ratios reaching -41.2‰ and CO2 minima of 182 ppm. Modern firn layers exhibit an accelerating isotopic enrichment trend corresponding to a +1.2°C warming anomaly over the past three decades.`,
    discussion: `The observed isotopic shifts align with global Antarctic temperature proxies, while local continental dynamics indicate reduced firn compaction rates due to periodic summer surface melting events near coastal bluffs. Inter-laboratory calibrations confirm measurement precision within ±0.05‰ for δ18O.`,
    limitations: `Uncertainties in bubble-ice age offsets (Δdepth) remain approximately ±40 years in upper firn zones prior to complete pore closure at density 0.83 g/cm³.`,
    conclusion: `Deep ice core stratigraphy at Larsemann Hills provides a reliable multi-centennial baseline for East Antarctic climate variability. Continued monitoring and high-resolution gas analysis will refine predictive ice sheet mass balance models.`,
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-28 pb-24 w-full space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#0D1211]/10 text-xs font-mono text-[#747A75] gap-4">
          <div className="flex items-center gap-2">
            <Link href="/publications" className="hover:text-[#0D1211]">Publications</Link>
            <span>/</span>
            <span className="text-[#0D1211] font-semibold">{publication.journal}</span>
            <span>/</span>
            <span className="truncate max-w-xs">{publication.slug}</span>
          </div>
          <div className="flex items-center gap-2">
            <VerificationBadge status={publication.isDemoRecord ? 'DEMO' : 'VERIFIED'} />
            <button
              onClick={() => setShowCitationModal(true)}
              className="px-3 py-1.5 rounded bg-[#0D1211] text-[#B7FF5A] font-mono text-xs uppercase flex items-center gap-1.5 hover:bg-[#192220]"
            >
              <FileText className="w-3.5 h-3.5" /> Export Citation
            </button>
          </div>
        </div>

        {/* Paper Title & Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#3D7BFF] text-white font-semibold">
              {publication.journal}
            </span>
            <span className="text-xs font-mono text-[#747A75]">
              Year {publication.year} {publication.volume ? `· Vol ${publication.volume}` : ''}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#2E7D32]/20 text-[#2E7D32] border border-[#2E7D32]/30 font-semibold">
              OPEN ACCESS
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0D1211] leading-tight">
            {publication.title}
          </h1>

          <div className="space-y-1 text-xs font-mono text-[#747A75]">
            <p className="text-[#0D1211] font-medium">
              Authors: {publication.authors?.map((a) => a.name).join(', ')}
            </p>
            <p>DOI: <span className="text-[#3D7BFF] font-semibold">{publication.doi}</span></p>
          </div>
        </div>

        {/* READING MODE SELECTOR BAR */}
        <div className="p-2 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#747A75] uppercase text-[10px] pl-2">Reading Mode:</span>
            {[
              { id: 'QUICK', label: '⚡ Quick Read (2 min)', icon: Sparkles },
              { id: 'STUDENT', label: '🎓 Student / Educator', icon: GraduationCap },
              { id: 'GENERAL', label: '📖 General Public', icon: BookOpen },
              { id: 'RESEARCH', label: '🔬 Full Scientific Paper', icon: FileText },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setReadingMode(id as ReadingMode)}
                className={`px-3 py-2 rounded-xl uppercase transition-all font-semibold ${
                  readingMode === id
                    ? 'bg-[#0D1211] text-[#B7FF5A] shadow-sm'
                    : 'text-[#747A75] hover:text-[#0D1211] hover:bg-[#F4F2EC]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[#747A75] pr-2 hidden lg:inline">
            Estimated Reading Time: {readingMode === 'RESEARCH' ? '18 mins' : readingMode === 'GENERAL' ? '6 mins' : '2 mins'}
          </span>
        </div>

        {/* MODE 1: QUICK READ */}
        {readingMode === 'QUICK' && (
          <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-mono text-[#3D7BFF] uppercase font-semibold">
              <Sparkles className="w-4 h-4" /> 2-Minute Executive Summary & Key Takeaways
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-medium text-[#0D1211]">Why This Research Matters</h3>
              <p className="text-sm text-[#747A75] leading-relaxed font-light">
                By drilling 1,200 meters into Antarctic ice, scientists recovered an unbroken atmospheric record spanning 120,000 years, providing crucial baselines for predicting future sea-level rise.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <span className="text-[10px] text-[#747A75] uppercase font-semibold">Key Scientific Findings:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 space-y-1">
                  <span className="text-2xl font-bold text-[#0D1211]">120k Years</span>
                  <p className="text-[#747A75]">Continuous atmospheric baseline recovered</p>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 space-y-1">
                  <span className="text-2xl font-bold text-[#3D7BFF]">-41.2‰ δ¹⁸O</span>
                  <p className="text-[#747A75]">Glacial peak isotopic minimum</p>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 space-y-1">
                  <span className="text-2xl font-bold text-[#2E7D32]">+1.2°C Shift</span>
                  <p className="text-[#747A75]">Warming anomaly over past 30 years</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: STUDENT / EDUCATOR */}
        {readingMode === 'STUDENT' && (
          <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-mono text-[#2E7D32] uppercase font-semibold">
              <GraduationCap className="w-4 h-4" /> Educational Concept Explainer & Glossary
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="p-5 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 space-y-2">
                <span className="text-[#3D7BFF] font-semibold">1. What Did Scientists Study?</span>
                <p className="text-[#747A75] font-sans font-light text-sm">
                  Researchers extracted ice cylinders from Antarctica to measure trapped air bubbles and heavy oxygen isotopes.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 space-y-2">
                <span className="text-[#3D7BFF] font-semibold">2. Why Does It Matter?</span>
                <p className="text-[#747A75] font-sans font-light text-sm">
                  It allows scientists to see what Earth's atmosphere was like long before humans built factories or cars.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0D1211] text-[#F4F2EC] space-y-3 font-mono text-xs">
              <span className="text-[#B7FF5A] uppercase text-[10px]">Student Glossary Tooltips</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div><strong className="text-[#B7FF5A]">Firn:</strong> Compacted granular snow that has survived summer melting.</div>
                <div><strong className="text-[#B7FF5A]">Isotope Proxy:</strong> Chemical telltale ratio (δ¹⁸O) used to calculate past temperature.</div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: GENERAL PUBLIC */}
        {readingMode === 'GENERAL' && (
          <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0D1211] uppercase font-semibold">
              <BookOpen className="w-4 h-4 text-[#3D7BFF]" /> Public Narrative & Science Story
            </div>

            <div className="prose prose-slate max-w-none text-base leading-relaxed font-light text-[#0D1211] space-y-4">
              <p>{publication.abstract}</p>
              <p>{fullText.introduction}</p>
              <p>{fullText.results}</p>
            </div>
          </div>
        )}

        {/* MODE 4: FULL RESEARCH PAPER WITH STICKY TOC */}
        {readingMode === 'RESEARCH' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sticky Table of Contents Sidebar */}
            <div className="lg:col-span-3 sticky top-28 space-y-3 p-4 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#0D1211] font-semibold border-b border-[#0D1211]/10 pb-2">
                <List className="w-4 h-4" /> Paper Contents
              </div>
              <nav className="space-y-1 text-[#747A75]">
                {[
                  { id: 'abstract', label: 'Abstract' },
                  { id: 'introduction', label: '1. Introduction' },
                  { id: 'background', label: '2. Background' },
                  { id: 'methodology', label: '3. Methodology' },
                  { id: 'studyArea', label: '4. Study Area & Instruments' },
                  { id: 'results', label: '5. Results' },
                  { id: 'figures', label: '6. Figures & Data Tables' },
                  { id: 'discussion', label: '7. Discussion' },
                  { id: 'conclusion', label: '8. Conclusion' },
                  { id: 'references', label: '9. References' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="w-full text-left py-1 px-2 rounded hover:bg-[#F4F2EC] hover:text-[#0D1211] block transition-colors text-[11px]"
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Full-Text Scientific Article */}
            <div className="lg:col-span-9 space-y-10">
              {/* Abstract Section */}
              <section id="abstract" className="p-6 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-2">
                <h2 className="font-mono text-xs uppercase font-bold text-[#747A75]">Abstract</h2>
                <p className="text-sm text-[#0D1211] font-light leading-relaxed">{publication.abstract}</p>
              </section>

              {/* Introduction Section */}
              <section id="introduction" className="space-y-3">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">1. Introduction</h2>
                <p className="text-sm text-[#747A75] font-light leading-relaxed whitespace-pre-line">{fullText.introduction}</p>
              </section>

              {/* Background Section */}
              {fullText.background && (
                <section id="background" className="space-y-3">
                  <h2 className="font-serif text-2xl font-medium text-[#0D1211]">2. Background</h2>
                  <p className="text-sm text-[#747A75] font-light leading-relaxed whitespace-pre-line">{fullText.background}</p>
                </section>
              )}

              {/* Methodology Section */}
              <section id="methodology" className="space-y-3">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">3. Methodology</h2>
                <p className="text-sm text-[#747A75] font-light leading-relaxed whitespace-pre-line">{fullText.methodology}</p>
              </section>

              {/* Study Area & Instrumentation Section */}
              <section id="studyArea" className="space-y-3">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">4. Study Area & Instrumentation</h2>
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/10 font-mono text-xs space-y-2">
                  <p><strong>Study Location:</strong> {fullText.studyArea}</p>
                  <p><strong>Sensors & Instruments:</strong> {fullText.instrumentation}</p>
                </div>
              </section>

              {/* Results Section */}
              <section id="results" className="space-y-3">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">5. Results</h2>
                <p className="text-sm text-[#747A75] font-light leading-relaxed whitespace-pre-line">{fullText.results}</p>
              </section>

              {/* Figures & Data Tables Section */}
              <section id="figures" className="space-y-4">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">6. Figures & Data Tables</h2>
                <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-[#0D1211]">Table 1: Larsemann Core Depth vs Isotope Data</span>
                    <span className="px-2 py-0.5 rounded bg-[#3D7BFF]/10 text-[#3D7BFF] font-semibold">DEMO TABLE</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#0D1211]/15 text-[#747A75]">
                          <th className="py-2 px-3">Depth (m)</th>
                          <th className="py-2 px-3">Est. Age (yr BP)</th>
                          <th className="py-2 px-3">δ¹⁸O (‰)</th>
                          <th className="py-2 px-3">CO₂ (ppm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#0D1211]/10">
                        <tr><td className="py-2 px-3">10</td><td className="py-2 px-3">50</td><td className="py-2 px-3">-34.20</td><td className="py-2 px-3">280</td></tr>
                        <tr><td className="py-2 px-3">150</td><td className="py-2 px-3">1,840</td><td className="py-2 px-3">-35.80</td><td className="py-2 px-3">275</td></tr>
                        <tr><td className="py-2 px-3">500</td><td className="py-2 px-3">25,300</td><td className="py-2 px-3">-41.20</td><td className="py-2 px-3">185</td></tr>
                        <tr><td className="py-2 px-3">1,000</td><td className="py-2 px-3">120,000</td><td className="py-2 px-3">-33.10</td><td className="py-2 px-3">282</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Discussion Section */}
              <section id="discussion" className="space-y-3">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">7. Discussion & Limitations</h2>
                <p className="text-sm text-[#747A75] font-light leading-relaxed whitespace-pre-line">{fullText.discussion}</p>
                {fullText.limitations && (
                  <p className="text-xs font-mono text-[#747A75] italic bg-[#FAF9F5] p-3 rounded border border-[#0D1211]/10">
                    <strong>Limitations:</strong> {fullText.limitations}
                  </p>
                )}
              </section>

              {/* Conclusion Section */}
              <section id="conclusion" className="space-y-3">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">8. Conclusion</h2>
                <p className="text-sm text-[#747A75] font-light leading-relaxed whitespace-pre-line">{fullText.conclusion}</p>
              </section>

              {/* References Section */}
              <section id="references" className="space-y-3 border-t border-[#0D1211]/10 pt-6">
                <h2 className="font-serif text-2xl font-medium text-[#0D1211]">9. References</h2>
                <ol className="space-y-2 font-mono text-xs text-[#747A75] list-decimal pl-5">
                  <li>Vance, E. et al. (2024). High-latitude firn gas trapping dynamics. <em>Nature Earth Systems</em>, 12(4), 188-204. doi:10.1038/s41561-024-01429-w</li>
                  <li>Lindqvist, K. (2023). Dry-core electromechanical drilling performance at Larsemann Hills. <em>Journal of Glaciology</em>, 69(275), 412-425.</li>
                  <li>Sen, A. & Thorne, M. (2022). Multi-centennial isotope baselines in Prydz Bay. <em>Antarctic Science Review</em>, 34(1), 45-60.</li>
                </ol>
              </section>
            </div>
          </div>
        )}

        {/* BibTeX Direct Snippet */}
        <div className="p-6 rounded-xl bg-[#0D1211] text-[#F4F2EC] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#B7FF5A]">
              BibTeX Citation Reference
            </span>
            <button
              onClick={handleCopyBibtex}
              className="px-2.5 py-1 bg-[#192220] rounded text-[11px] text-[#B7FF5A] hover:bg-[#25322F] flex items-center gap-1.5"
            >
              {copiedBibtex ? <Check className="w-3 h-3 text-[#B7FF5A]" /> : <Copy className="w-3 h-3" />}
              {copiedBibtex ? 'Copied' : 'Copy BibTeX'}
            </button>
          </div>
          <pre className="p-3 bg-[#192220] rounded-lg overflow-x-auto text-[#747A75]">
            {bibtex}
          </pre>
        </div>

        {/* Linked Datasets Section */}
        {datasets.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#747A75]">
                Primary Derived Datasets
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datasets.map((d) => (
                <Link
                  key={d.slug}
                  href={`/datasets/${d.slug}`}
                  className="p-5 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] hover:border-[#0D1211] transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#3D7BFF]">
                      <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Telemetry Dataset</span>
                      <span>Level {d.processingLevel}</span>
                    </div>
                    <h4 className="font-serif text-lg font-medium text-[#0D1211] mt-2 group-hover:text-[#3D7BFF] transition-colors line-clamp-2">
                      {d.title}
                    </h4>
                  </div>
                  <div className="pt-2 border-t border-[#0D1211]/10 flex justify-between text-xs font-mono text-[#747A75]">
                    <span>DOI: {d.doi}</span>
                    <span className="text-[#0D1211] font-semibold group-hover:underline">Open Dataset →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Citation Modal */}
      {publication && (
        <CitationModal
          isOpen={showCitationModal}
          onClose={() => setShowCitationModal(false)}
          title={publication.title}
          citations={{
            plainText: `${publication.authors?.map((a) => a.name).join(', ')} (${publication.year}). ${publication.title}. ${publication.journal}. https://doi.org/${publication.doi}`,
            bibtex,
            ris: `TY  - JOUR\nTI  - ${publication.title}\nAU  - ${publication.authors?.[0]?.name}\nJO  - ${publication.journal}\nPY  - ${publication.year}\nDO  - ${publication.doi}\nER  - `,
            json: JSON.stringify(publication, null, 2),
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default PublicationDetailPage;
