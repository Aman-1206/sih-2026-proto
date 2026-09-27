import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Sparkles, X, ChevronRight, ChevronLeft, Compass, CheckCircle2 } from 'lucide-react';

interface TourStep {
  stepNumber: number;
  title: string;
  description: string;
  route: string;
  highlightTag: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    stepNumber: 1,
    title: '1. Global Hybrid Search',
    description: 'Perform exact lexical, DOI, and semantic searches across all indexed scientific entities.',
    route: '/search',
    highlightTag: 'Hybrid Search (Lexical + Vector)',
  },
  {
    stepNumber: 2,
    title: '2. FAIR Dataset Repository',
    description: 'Explore calibrated time-series, variable tables, geospatial bounds, and BibTeX/JSON-LD citations.',
    route: '/datasets/larsemann-hills-boundary-met-2024',
    highlightTag: 'FAIR Data & Provenance',
  },
  {
    stepNumber: 3,
    title: '3. Connected Knowledge Graph',
    description: 'Inspect visual relationships between research stations, expeditions, datasets, publications, and scientists.',
    route: '/knowledge-graph',
    highlightTag: 'Knowledge Model',
  },
  {
    stepNumber: 4,
    title: '4. Ask ORUVIA (RAG AI)',
    description: 'Ask scientific questions in plain English and receive answers backed by direct citation chips.',
    route: '/ask',
    highlightTag: 'Evidence-Grounded AI',
  },
  {
    stepNumber: 5,
    title: '5. Institutional Content Studio',
    description: 'Translate verified research into multi-channel public communication without losing source provenance.',
    route: '/studio',
    highlightTag: 'Multi-Platform Outreach',
  },
  {
    stepNumber: 6,
    title: '6. Evidence Lock Technology',
    description: 'Verify factual claims sentence-by-sentence before approving content for publication.',
    route: '/studio/drafts/d1',
    highlightTag: 'Evidence Verification',
  },
  {
    stepNumber: 7,
    title: '7. Review & Approval Workflow',
    description: 'Track editorial status from Draft → AI Generated → Needs Review → Approved → Scheduled → Published.',
    route: '/studio',
    highlightTag: 'Role-Based Workflow',
  },
  {
    stepNumber: 8,
    title: '8. Publishing Calendar',
    description: 'Schedule outreach assets across X, Instagram, LinkedIn, and newsletters with integration status badges.',
    route: '/studio',
    highlightTag: 'Publication Schedule',
  },
];

export const DemoTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [, setLocation] = useLocation();

  const step = TOUR_STEPS[currentStepIndex];

  const handleNavigateStep = (index: number) => {
    setCurrentStepIndex(index);
    setLocation(TOUR_STEPS[index].route);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setLocation(step.route);
        }}
        className="fixed bottom-6 left-6 z-50 px-4 py-2.5 rounded-full bg-[#0D1211] text-[#B7FF5A] font-mono text-xs uppercase font-semibold border border-[#B7FF5A]/40 shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group"
      >
        <Sparkles className="w-4 h-4 text-[#B7FF5A] group-hover:rotate-12 transition-transform" />
        <span>Take Interactive Demo Tour</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-md w-full bg-[#0D1211] text-[#F4F2EC] border border-[#B7FF5A]/40 rounded-2xl p-5 shadow-2xl space-y-4 font-mono animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between pb-2 border-b border-[#747A75]/30 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B7FF5A] animate-pulse" />
          <span className="text-[#B7FF5A] font-semibold">SIH Jury Demo Tour</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[#747A75] hover:text-[#F4F2EC] text-sm p-1"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] text-[#747A75] uppercase">
          <span>Step {currentStepIndex + 1} of 8</span>
          <span className="px-2 py-0.5 rounded bg-[#131B19] text-[#3D7BFF] border border-[#3D7BFF]/30">{step.highlightTag}</span>
        </div>
        <h4 className="font-serif text-xl font-normal text-[#F4F2EC] font-sans">{step.title}</h4>
        <p className="text-xs text-[#747A75] font-sans font-light leading-relaxed">{step.description}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#747A75]/30 text-xs">
        <button
          onClick={() => handleNavigateStep(Math.max(0, currentStepIndex - 1))}
          disabled={currentStepIndex === 0}
          className="px-3 py-1.5 rounded bg-[#131B19] text-[#747A75] hover:text-[#F4F2EC] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>

        <div className="flex gap-1">
          {TOUR_STEPS.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${idx === currentStepIndex ? 'bg-[#B7FF5A]' : 'bg-[#747A75]/40'}`}
            />
          ))}
        </div>

        {currentStepIndex < 7 ? (
          <button
            onClick={() => handleNavigateStep(currentStepIndex + 1)}
            className="px-3.5 py-1.5 rounded bg-[#B7FF5A] text-[#0D1211] font-semibold hover:bg-lime-400 flex items-center gap-1"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(false)}
            className="px-3.5 py-1.5 rounded bg-[#B7FF5A] text-[#0D1211] font-semibold hover:bg-lime-400 flex items-center gap-1"
          >
            Finish Tour ✓
          </button>
        )}
      </div>
    </div>
  );
};
