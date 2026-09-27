import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  UploadCloud,
  CheckCircle2,
  Database,
  FileText,
  Image as ImageIcon,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
  FileCheck,
} from 'lucide-react';
import { ResourceType, ScienceDomain } from '@oruvia/shared';
import { api } from '../../services/api';

export const UploadWizard: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [resourceType, setResourceType] = useState<ResourceType>('dataset');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form Metadata State
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    creators: 'Dr. Evelyn Vance, Kasper Lindqvist',
    scienceDomains: ['Atmosphere', 'Cryosphere'] as ScienceDomain[],
    spatialRegion: 'East Antarctica (Larsemann Hills)',
    latitude: -69.4072,
    longitude: 76.1873,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    instrument: 'Automated Weather Station Mast & Sonic Anemometer',
    license: 'CC-BY-4.0',
    accessRights: 'OPEN',
    stationId: '',
    expeditionId: '',
    doi: '10.5281/oruvia.2026.' + Math.floor(10000 + Math.random() * 90000),
  });

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setUploadProgress(40);
    setTimeout(() => setUploadProgress(100), 400);

    // Auto trigger Step 3: AI Extraction simulation
    setIsExtracting(true);
    try {
      const extracted = await api.ai.extractMetadata(uploadedFile.name, uploadedFile.type);
      setFormData((prev) => ({
        ...prev,
        title: extracted.suggestedTitle || prev.title,
        abstract: extracted.suggestedAbstract || prev.abstract,
        scienceDomains: extracted.detectedDomains || prev.scienceDomains,
        spatialRegion: extracted.spatialCoordinates?.regionName || prev.spatialRegion,
        latitude: extracted.spatialCoordinates?.latitude || prev.latitude,
        longitude: extracted.spatialCoordinates?.longitude || prev.longitude,
      }));
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (resourceType === 'dataset') {
        await api.datasets.create({
          slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
          title: formData.title,
          abstract: formData.abstract,
          description: formData.abstract,
          creators: formData.creators.split(',').map((c) => ({ name: c.trim() })),
          organizations: ['Global Earth Observation Directorate'],
          keywords: ['Polar Science', 'Observation', 'Open Data'],
          scienceDomains: formData.scienceDomains,
          spatialCoverage: {
            regionName: formData.spatialRegion,
            latitude: formData.latitude,
            longitude: formData.longitude,
          },
          temporalCoverage: {
            startDate: formData.startDate,
            endDate: formData.endDate,
          },
          instrument: formData.instrument,
          variables: [
            { name: 'Air Temperature', unit: '°C', description: 'Calibrated ambient sensor', dataType: 'Float' },
            { name: 'Wind Velocity', unit: 'm/s', description: 'Ultrasonic anemometer', dataType: 'Float' },
          ],
          processingLevel: 'L2',
          formats: ['CSV', 'NetCDF-4'],
          fileSizeMb: file ? parseFloat((file.size / (1024 * 1024)).toFixed(2)) : 14.5,
          version: '1.0.0',
          license: formData.license,
          accessRights: formData.accessRights as any,
          doi: formData.doi,
          citationText: `${formData.creators} (2026). ${formData.title}. ORUVIA Repository. https://doi.org/${formData.doi}`,
          provenance: 'Submitted via ORUVIA 8-step Contributor Pipeline.',
          isDemoRecord: false,
        });
      }
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#B7FF5A] text-[#0D1211] flex items-center justify-center mx-auto shadow-lg">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-medium text-[#0D1211]">
          Resource Submitted for Verification
        </h2>
        <p className="text-sm text-[#747A75] max-w-md mx-auto">
          Your scientific resource has been indexed and routed to the peer review board. Telemetry schemas and FAIR compliance checks have been queued.
        </p>
        <div className="pt-6 flex justify-center gap-3">
          <button
            onClick={() => setLocation('/studio/datasets')}
            className="px-5 py-2.5 rounded-lg bg-[#0D1211] text-[#F4F2EC] text-xs font-mono uppercase tracking-wider hover:bg-[#192220]"
          >
            View Repository Datasets
          </button>
          <button
            onClick={() => { setSubmitted(false); setCurrentStep(1); setFile(null); }}
            className="px-5 py-2.5 rounded-lg border border-[#0D1211]/20 text-xs font-mono uppercase tracking-wider hover:bg-[#EBE8DF]"
          >
            Upload Another
          </button>
        </div>
      </div>
    );
  }

  const STEPS = [
    '1. Resource Type',
    '2. File Upload',
    '3. AI Extraction',
    '4. Review Metadata',
    '5. Relationships',
    '6. Rights & License',
    '7. Preview',
    '8. Submit',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Wizard Progress Stepper */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75] block mb-2">
          Step {currentStep} of 8 — Contributor Pipeline
        </span>
        <div className="grid grid-cols-8 gap-1.5">
          {STEPS.map((s, idx) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                idx + 1 < currentStep
                  ? 'bg-[#B7FF5A]'
                  : idx + 1 === currentStep
                  ? 'bg-[#0D1211]'
                  : 'bg-[#EBE8DF]'
              }`}
            />
          ))}
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#0D1211] mt-4">
          {STEPS[currentStep - 1]}
        </h2>
      </div>

      {/* Step Contents */}
      <div className="border border-[#0D1211]/15 rounded-xl bg-[#FAF9F5] p-6 sm:p-8">
        {/* STEP 1: Select Resource Type */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-[#747A75]">
              Select the classification of scientific resource you are archiving into ORUVIA:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { type: 'dataset', label: 'Scientific Dataset', icon: Database, desc: 'Calibrated time-series, matrices, NetCDF, CSV' },
                { type: 'publication', label: 'Research Publication', icon: FileText, desc: 'Peer-reviewed articles, preprints, reports' },
                { type: 'expedition', label: 'Expedition Report', icon: MapPin, desc: 'Field logs, cruise tracks, milestone digests' },
                { type: 'media', label: 'Archival Media', icon: ImageIcon, desc: 'Calibrated field photography, video, audio' },
                { type: 'activity', label: 'Institutional Activity', icon: Sparkles, desc: 'Workshops, symposia, educational programs' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = resourceType === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => setResourceType(item.type as any)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0D1211] bg-[#0D1211] text-[#F4F2EC] shadow-md'
                        : 'border-[#0D1211]/10 bg-[#F4F2EC] text-[#0D1211] hover:border-[#0D1211]/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#B7FF5A]' : 'text-[#747A75]'}`} />
                    <h4 className="font-semibold text-sm">{item.label}</h4>
                    <p className={`text-xs mt-1 ${isSelected ? 'text-[#747A75]' : 'text-[#747A75]'}`}>{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: File Upload */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              className="border-2 border-dashed border-[#0D1211]/20 rounded-xl p-10 text-center hover:border-[#0D1211] transition-colors cursor-pointer bg-[#F4F2EC]/40"
            >
              <UploadCloud className="w-10 h-10 text-[#747A75] mx-auto mb-3" />
              <p className="text-sm font-medium text-[#0D1211]">
                Drag and drop your raw telemetry, CSV, NetCDF, or PDF report here
              </p>
              <p className="text-xs text-[#747A75] mt-1">Supports files up to 500 MB</p>
              <input
                type="file"
                id="file-input"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <label
                htmlFor="file-input"
                className="inline-block mt-4 px-4 py-2 bg-[#0D1211] text-[#F4F2EC] rounded-lg text-xs font-mono uppercase cursor-pointer hover:bg-[#192220]"
              >
                Browse Files
              </label>
            </div>

            {file && (
              <div className="p-4 rounded-lg bg-[#F4F2EC] border border-[#0D1211]/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-semibold text-[#0D1211]">{file.name}</span>
                  <span className="text-[#747A75] ml-2">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
                <div className="flex items-center gap-2 text-[#2E7D32]">
                  <CheckCircle2 className="w-4 h-4" /> Ready for AI Extraction
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: AI Extraction Simulation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-[#B7FF5A]/15 border border-[#7bc418]/30 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2E7D32]" />
                <h4 className="font-serif text-lg font-medium text-[#0D1211]">
                  AI Metadata & Variable Auto-Detection
                </h4>
              </div>
              <p className="text-xs text-[#0D1211] leading-relaxed">
                The ingestion model parsed document structure, detected geospatial bounds, extracted variable units, and inferred relevant science domains:
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
                <div className="p-3 bg-white/70 rounded-lg border border-[#0D1211]/5">
                  <span className="text-[10px] text-[#747A75] block uppercase">Detected Title:</span>
                  <p className="font-semibold mt-0.5 text-[#0D1211]">{formData.title || 'Observational Meteorological Series: East Antarctica'}</p>
                </div>
                <div className="p-3 bg-white/70 rounded-lg border border-[#0D1211]/5">
                  <span className="text-[10px] text-[#747A75] block uppercase">Detected Coordinates:</span>
                  <p className="font-semibold mt-0.5 text-[#0D1211]">{formData.latitude}°N, {formData.longitude}°E</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review Extracted Metadata */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase text-[#747A75]">Title</label>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#3D7BFF]/15 text-[#3D7BFF] border border-[#3D7BFF]/30">
                  AI SUGGESTED
                </span>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-[#0D1211]/15 bg-[#F4F2EC] text-sm text-[#0D1211] focus:outline-none focus:border-[#0D1211]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase text-[#747A75]">Abstract / Description</label>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#3D7BFF]/15 text-[#3D7BFF] border border-[#3D7BFF]/30">
                  AI SUGGESTED
                </span>
              </div>
              <textarea
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                rows={4}
                className="w-full p-2.5 rounded-lg border border-[#0D1211]/15 bg-[#F4F2EC] text-sm text-[#0D1211] focus:outline-none focus:border-[#0D1211]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#747A75] mb-1">Creators / Authors</label>
                <input
                  type="text"
                  value={formData.creators}
                  onChange={(e) => setFormData({ ...formData, creators: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#0D1211]/15 bg-[#F4F2EC] text-xs font-mono text-[#0D1211]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#747A75] mb-1">Sensor / Instrument</label>
                <input
                  type="text"
                  value={formData.instrument}
                  onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#0D1211]/15 bg-[#F4F2EC] text-xs font-mono text-[#0D1211]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Relationships */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <p className="text-sm text-[#747A75]">
              Connect this resource with field stations and expedition archives to populate the Knowledge Graph:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#747A75] mb-1">Associated Station</label>
                <select
                  value={formData.stationId}
                  onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#0D1211]/15 bg-[#F4F2EC] text-xs font-mono text-[#0D1211]"
                >
                  <option value="">-- None / Marine Cast --</option>
                  <option value="bharati-station">Bharati Research Station (East Antarctica)</option>
                  <option value="maitri-station">Maitri Station (Dronning Maud Land)</option>
                  <option value="himadri-station">Himadri Arctic Station (Svalbard)</option>
                  <option value="himansh-observatory">Himansh Observatory (Himalayas)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#747A75] mb-1">Associated Expedition</label>
                <select
                  value={formData.expeditionId}
                  onChange={(e) => setFormData({ ...formData, expeditionId: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#0D1211]/15 bg-[#F4F2EC] text-xs font-mono text-[#0D1211]"
                >
                  <option value="">-- None / Independent --</option>
                  <option value="expedition-antarctic-43">43rd Scientific Expedition to Antarctica (ISEA-43)</option>
                  <option value="expedition-arctic-summer-2024">Svalbard Kongsfjorden Bio-Oceanic Campaign</option>
                  <option value="expedition-southern-ocean-transsect">Southern Ocean Hydrographic Expedition</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Rights and License */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#747A75] mb-1">Access Rights</label>
                <select
                  value={formData.accessRights}
                  onChange={(e) => setFormData({ ...formData, accessRights: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#0D1211]/15 bg-[#F4F2EC] text-xs font-mono text-[#0D1211]"
                >
                  <option value="OPEN">Open Access (FAIR Compliant)</option>
                  <option value="RESTRICTED">Restricted to Consortium</option>
                  <option value="EMBARGOED">Embargoed (12 Months)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#747A75] mb-1">License</label>
                <select
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#0D1211]/15 bg-[#F4F2EC] text-xs font-mono text-[#0D1211]"
                >
                  <option value="CC-BY-4.0">Creative Commons Attribution 4.0 (CC-BY-4.0)</option>
                  <option value="CC0-1.0">Public Domain Dedication (CC0)</option>
                  <option value="MIT">MIT Open Data License</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F4F2EC] border border-[#0D1211]/10 text-xs text-[#747A75] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>
                Generated Digital Object Identifier (DOI): <strong className="text-[#0D1211] font-mono">{formData.doi}</strong>
              </span>
            </div>
          </div>
        )}

        {/* STEP 7: Preview */}
        {currentStep === 7 && (
          <div className="space-y-4 font-mono text-xs">
            <h4 className="font-serif text-xl font-medium text-[#0D1211]">{formData.title || 'Untitled Dataset'}</h4>
            <p className="text-[#747A75] leading-relaxed">{formData.abstract}</p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#0D1211]/10 text-[11px]">
              <div>Creators: <span className="text-[#0D1211]">{formData.creators}</span></div>
              <div>Region: <span className="text-[#0D1211]">{formData.spatialRegion}</span></div>
              <div>Access: <span className="text-[#0D1211]">{formData.accessRights}</span></div>
              <div>License: <span className="text-[#0D1211]">{formData.license}</span></div>
            </div>
          </div>
        )}

        {/* STEP 8: Submit for Review */}
        {currentStep === 8 && (
          <div className="space-y-4 text-center py-6">
            <FileCheck className="w-12 h-12 text-[#3D7BFF] mx-auto" />
            <h3 className="font-serif text-2xl text-[#0D1211]">Ready for Repository Review</h3>
            <p className="text-xs text-[#747A75] max-w-md mx-auto">
              Submitting will run automated schema validation, generate vector embeddings, and notify reviewers on the editorial board.
            </p>
          </div>
        )}
      </div>

      {/* Stepper Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 rounded-lg border border-[#0D1211]/20 text-xs font-mono uppercase flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#EBE8DF]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
        </button>

        {currentStep < 8 ? (
          <button
            onClick={() => setCurrentStep(Math.min(8, currentStep + 1))}
            className="px-5 py-2 rounded-lg bg-[#0D1211] text-[#F4F2EC] text-xs font-mono uppercase flex items-center gap-1.5 hover:bg-[#192220]"
          >
            Next Step <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-[#0D1211] text-[#B7FF5A] text-xs font-mono uppercase font-semibold flex items-center gap-1.5 hover:bg-[#192220] shadow-md"
          >
            {isSubmitting ? 'Submitting to Review Board...' : 'Submit Resource for Review'}
          </button>
        )}
      </div>
    </div>
  );
};
