import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Globe2, Layers, MapPin, Radio, Database, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ScientificAtlas } from '../components/visualizers/ScientificAtlas';
import { api } from '../services/api';

export const AtlasPage: React.FC = () => {
  const [layersData, setLayersData] = useState<any>(null);

  useEffect(() => {
    api.atlas.getLayers().then((data) => setLayersData(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1211] text-[#F4F2EC] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-8 pt-28 pb-16 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#747A75]/20">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#B7FF5A] uppercase">
              Interactive Geospatial Platform
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#F4F2EC]">
              Scientific Atlas
            </h1>
          </div>
          <div className="text-xs font-mono text-[#747A75]">
            Projection: Global Equirectangular · WGS84
          </div>
        </div>

        <ScientificAtlas layersData={layersData} height="700px" />
      </main>

      <Footer />
    </div>
  );
};

export const TimelinePage: React.FC = () => {
  const [expeditions, setExpeditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.expeditions.list()
      .then((data) => setExpeditions(data.expeditions))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-5xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-12">
        <div className="space-y-2 pb-6 border-b border-[#0D1211]/10">
          <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase">
            Multi-Decadal Archival Record
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#0D1211]">
            Expedition Timeline
          </h1>
          <p className="text-sm sm:text-base text-[#747A75] font-light">
            An unbroken timeline tracing polar campaigns, ice-shelf drilling operations, and deep oceanographic cruises.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-[#747A75]">Loading timeline archive...</div>
        ) : (
          <div className="relative border-l-2 border-[#0D1211] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
            {expeditions.map((exp) => (
              <div key={exp.slug} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[47px] top-4 w-5 h-5 rounded-full bg-[#0D1211] border-4 border-[#F4F2EC]" />

                <div className="p-6 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] space-y-3 hover:border-[#0D1211] transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] font-semibold">{exp.number}</span>
                    <span className="text-[#747A75]">{exp.dates?.startDate} to {exp.dates?.endDate}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-medium text-[#0D1211]">{exp.name}</h3>
                  <p className="text-xs font-mono text-[#3D7BFF]">{exp.region}</p>
                  <p className="text-xs text-[#747A75] font-light leading-relaxed">{exp.overview}</p>

                  <div className="pt-2 flex justify-between items-center border-t border-[#0D1211]/10 text-xs font-mono">
                    <span className="text-[#747A75]">Lead: {exp.leadScientist?.name}</span>
                    <Link href={`/expeditions/${exp.slug}`} className="text-[#0D1211] font-semibold hover:underline flex items-center gap-1">
                      Explore Route <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AtlasPage;
