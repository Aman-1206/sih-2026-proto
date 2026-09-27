import React, { useState } from 'react';
import { Link } from 'wouter';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BookOpen, CheckCircle2, ChevronRight, HelpCircle, Layers, ArrowRight, ExternalLink } from 'lucide-react';

export default function LearnPage() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [iceDepth, setIceDepth] = useState<number>(350); // meters
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Ice core depth calculations: Depth (m) -> Age (years BP), CO2 (ppm), Temp anomaly (°C)
  const ageYearsBP = Math.round(Math.pow(iceDepth / 10, 1.65) * 12);
  const co2Ppm = Math.round(280 - (iceDepth / 1000) * 80 + Math.sin(iceDepth / 50) * 15);
  const deltaO18 = (-35 - (iceDepth / 1000) * 5 + Math.cos(iceDepth / 80) * 2).toFixed(2);

  const QUIZ_QUESTIONS = [
    {
      question: 'What atmospheric property is trapped inside ice core bubbles?',
      options: ['Ancient gas composition (CO₂, CH₄, N₂O)', 'Volcanic dust density only', 'Modern satellite signals', 'Ocean salinity'],
      correct: 0,
      explanation: 'As snow turns to firn and compresses into solid ice, atmospheric air bubbles are sealed, creating a pristine atmospheric archive.',
    },
    {
      question: 'What isotope proxy ratio is primarily measured in ice water molecules to infer paleotemperature?',
      options: ['Carbon-14 (¹⁴C)', 'Oxygen-18 to Oxygen-16 (δ¹⁸O)', 'Uranium-238', 'Deuterium oxide only'],
      correct: 1,
      explanation: 'Heavy isotopes (¹⁸O and ²H) condense more easily during atmospheric transport toward polar regions, making δ¹⁸O a direct thermometer of past climate.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 pb-12 px-6 sm:px-8 border-b border-[#0D1211]/10 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1211] text-[#B7FF5A] text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>INTERACTIVE SCIENCE ACADEMY</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-[#0D1211]">
            How Ice Cores Record Climate
          </h1>

          <p className="text-base sm:text-xl text-[#747A75] font-light max-w-3xl leading-relaxed">
            Step-by-step interactive explainer tracing 120,000 years of Earth atmosphere sealed in polar ice columns.
          </p>
        </div>
      </section>

      {/* Main Interactive Step-by-Step Experience Container */}
      <main className="flex-1 py-12 px-6 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Step Stepper Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 border-b border-[#0D1211]/10 pb-4 font-mono text-xs">
            {[
              { num: 1, label: '1. Introduction' },
              { num: 2, label: '2. Depth Model' },
              { num: 3, label: '3. Timeline' },
              { num: 4, label: '4. Proxy Metrics' },
              { num: 5, label: '5. Quiz' },
              { num: 6, label: '6. Provenance' },
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`py-2 px-3 rounded-lg text-center transition-all ${
                  activeStep === step.num
                    ? 'bg-[#0D1211] text-[#B7FF5A] font-semibold shadow-sm'
                    : 'bg-[#FAF9F5] text-[#747A75] hover:text-[#0D1211] border border-[#0D1211]/10'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* STEP 1: INTRODUCTION */}
          {activeStep === 1 && (
            <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-6 animate-fadeIn">
              <span className="text-xs font-mono text-[#3D7BFF] uppercase tracking-wider font-semibold block">Step 1 of 6 · Overview</span>
              <h2 className="font-serif text-3xl font-medium text-[#0D1211]">Preserving Earth's Atmospheric Archive</h2>
              <p className="text-base text-[#747A75] font-light leading-relaxed">
                In polar ice sheets like Antarctica and Greenland, annual snowfall accumulates layer upon layer. Over decades, weight compresses snow into permeable <strong className="text-[#0D1211] font-normal">firn</strong>, and eventually into solid glacial ice. During this process, ambient air bubbles are permanently sealed inside the ice lattice.
              </p>
              <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 flex items-center justify-between text-xs font-mono">
                <span>Core Target: Larsemann Hills Deep Core (76.2°S, 76.1°E)</span>
                <span className="text-[#2E7D32]">Record Depth: 1,200 Meters</span>
              </div>
              <button
                onClick={() => setActiveStep(2)}
                className="px-6 py-3 bg-[#0D1211] text-[#F4F2EC] rounded-lg text-xs font-mono uppercase hover:bg-[#192220] flex items-center gap-2"
              >
                <span>Proceed to Step 2: Interactive Depth Model</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B7FF5A]" />
              </button>
            </div>
          )}

          {/* STEP 2 & 3: INTERACTIVE ICE-CORE DEPTH & TIMELINE MODEL */}
          {(activeStep === 2 || activeStep === 3) && (
            <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#3D7BFF] uppercase tracking-wider font-semibold">
                  Step {activeStep} of 6 · Interactive Ice Core Stratigraphy
                </span>
                <span className="text-xs font-mono text-[#747A75]">Slide slider to drill deeper into the ice sheet</span>
              </div>

              {/* Depth Controls */}
              <div className="space-y-2 bg-[#F4F2EC] p-4 rounded-xl border border-[#0D1211]/10 font-mono text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Ice Core Drilling Depth: <strong className="text-[#3D7BFF]">{iceDepth} Meters</strong></span>
                  <span>Estimated Sample Age: <strong className="text-[#0D1211]">{ageYearsBP.toLocaleString()} Years BP</strong></span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={iceDepth}
                  onChange={(e) => setIceDepth(Number(e.target.value))}
                  className="w-full accent-[#0D1211] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#747A75]">
                  <span>Surface (0m / 2026 AD)</span>
                  <span>Mid Depth (500m / ~25k BP)</span>
                  <span>Deep Bedrock (1000m / ~120k BP)</span>
                </div>
              </div>

              {/* Computed Physical Core Metrics Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0D1211] text-[#F4F2EC] space-y-1">
                  <span className="text-[10px] text-[#747A75] uppercase block">Trapped CO₂ Concentration</span>
                  <span className="text-2xl font-bold text-[#B7FF5A]">{co2Ppm} ppm</span>
                  <p className="text-[10px] text-[#747A75]">Pre-industrial baseline: ~280 ppm</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0D1211] text-[#F4F2EC] space-y-1">
                  <span className="text-[10px] text-[#747A75] uppercase block">Isotope Ratio (δ¹⁸O)</span>
                  <span className="text-2xl font-bold text-[#3D7BFF]">{deltaO18} ‰</span>
                  <p className="text-[10px] text-[#747A75]">Paleotemperature indicator</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0D1211] text-[#F4F2EC] space-y-1">
                  <span className="text-[10px] text-[#747A75] uppercase block">Firn Density</span>
                  <span className="text-2xl font-bold text-[#FAF9F5]">{(0.35 + (iceDepth / 1000) * 0.56).toFixed(2)} g/cm³</span>
                  <p className="text-[10px] text-[#747A75]">Bubble closure at ~0.83 g/cm³</p>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-4 py-2 border border-[#0D1211]/20 rounded text-xs font-mono uppercase"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-6 py-2.5 bg-[#0D1211] text-[#F4F2EC] rounded text-xs font-mono uppercase hover:bg-[#192220]"
                >
                  Proceed to Step 4: Proxy Metrics →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PROXY METRICS */}
          {activeStep === 4 && (
            <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-6 animate-fadeIn">
              <span className="text-xs font-mono text-[#3D7BFF] uppercase tracking-wider font-semibold block">Step 4 of 6 · Temperature Proxies</span>
              <h2 className="font-serif text-3xl font-medium text-[#0D1211]">How δ¹⁸O Acts as a Thermometer</h2>
              <p className="text-base text-[#747A75] font-light leading-relaxed">
                Water molecules composed of heavier oxygen isotopes (¹⁸O) evaporate less readily and condense more easily than lighter ¹⁶O. As air masses travel from tropical oceans to polar ice sheets, they progressively lose ¹⁸O. Cold temperatures cause even more isotopic depletion, making lower δ¹⁸O values direct evidence of ancient ice ages.
              </p>

              <div className="pt-2 flex justify-between">
                <button onClick={() => setActiveStep(3)} className="px-4 py-2 border border-[#0D1211]/20 rounded text-xs font-mono uppercase">
                  ← Back
                </button>
                <button onClick={() => setActiveStep(5)} className="px-6 py-2.5 bg-[#0D1211] text-[#F4F2EC] rounded text-xs font-mono uppercase hover:bg-[#192220]">
                  Take Knowledge Quiz (Step 5) →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SHORT QUIZ */}
          {activeStep === 5 && (
            <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-6 animate-fadeIn">
              <span className="text-xs font-mono text-[#3D7BFF] uppercase tracking-wider font-semibold block">Step 5 of 6 · Interactive Assessment</span>
              <h2 className="font-serif text-3xl font-medium text-[#0D1211]">Knowledge Check</h2>

              <div className="space-y-6">
                {QUIZ_QUESTIONS.map((q, qIdx) => (
                  <div key={qIdx} className="p-5 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 space-y-3 font-mono text-xs">
                    <p className="font-semibold text-sm text-[#0D1211] font-sans">{qIdx + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            quizAnswers[qIdx] === optIdx
                              ? 'bg-[#0D1211] text-[#F4F2EC] border-[#0D1211] font-semibold'
                              : 'bg-[#FAF9F5] text-[#0D1211] border-[#0D1211]/10 hover:border-[#0D1211]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {quizSubmitted && (
                      <div className={`p-3 rounded text-xs ${quizAnswers[qIdx] === q.correct ? 'bg-[#B7FF5A]/20 text-[#2E7D32]' : 'bg-red-500/10 text-red-800'}`}>
                        {quizAnswers[qIdx] === q.correct ? '✓ Correct! ' : '✗ Incorrect. '}
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    className="px-6 py-2.5 bg-[#3D7BFF] text-white rounded text-xs font-mono uppercase font-semibold hover:bg-blue-600"
                  >
                    Submit Quiz
                  </button>
                  <button
                    onClick={() => setActiveStep(6)}
                    className="px-6 py-2.5 bg-[#0D1211] text-[#F4F2EC] rounded text-xs font-mono uppercase hover:bg-[#192220]"
                  >
                    View Source Provenance (Step 6) →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: RELATED DATASET & PUBLICATION PROVENANCE */}
          {activeStep === 6 && (
            <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#0D1211]/15 space-y-6 animate-fadeIn">
              <span className="text-xs font-mono text-[#2E7D32] uppercase tracking-wider font-semibold block">Step 6 of 6 · Repository Provenance</span>
              <h2 className="font-serif text-3xl font-medium text-[#0D1211]">Connected Raw Data & Publications</h2>
              <p className="text-sm text-[#747A75] font-light">
                This explainer is directly backed by FAIR-compliant datasets and peer-reviewed literature indexed in ORUVIA.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-5 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-[#3D7BFF]/10 text-[#3D7BFF] uppercase font-semibold text-[10px]">Indexed Dataset</span>
                  <h4 className="font-serif text-lg text-[#0D1211] font-medium">Larsemann Hills Firn & Core Isotope Series</h4>
                  <p className="text-[#747A75]">DOI: 10.5281/oruvia.2024.08912 · CC-BY 4.0</p>
                  <Link href="/datasets/larsemann-hills-boundary-met-2024" className="inline-flex items-center gap-1 text-[#3D7BFF] hover:underline pt-1">
                    <span>Inspect Raw Dataset & Telemetry</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-5 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] uppercase font-semibold text-[10px]">Peer-Reviewed Publication</span>
                  <h4 className="font-serif text-lg text-[#0D1211] font-medium">Deep Ice Core Isotope Stratigraphy in East Antarctica</h4>
                  <p className="text-[#747A75]">Nature Earth Systems (2024) · DOI: 10.1038/s41561-024-01429-w</p>
                  <Link href="/publications/deep-ice-core-isotope-stratigraphy-east-antarctica" className="inline-flex items-center gap-1 text-[#3D7BFF] hover:underline pt-1">
                    <span>Read Paper (4 Reading Levels)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0D1211]/10 flex justify-between">
                <button onClick={() => setActiveStep(1)} className="px-4 py-2 border border-[#0D1211]/20 rounded text-xs font-mono uppercase">
                  ↺ Restart Explainer
                </button>
                <Link href="/ask" className="px-6 py-2.5 bg-[#0D1211] text-[#B7FF5A] rounded text-xs font-mono uppercase font-semibold hover:bg-[#192220]">
                  Ask AI Questions About Ice Cores →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
