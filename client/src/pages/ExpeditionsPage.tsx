import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { MapPin, Calendar, Users, ArrowRight, Compass, Ship } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { IExpedition } from '@oruvia/shared';

export const ExpeditionsPage: React.FC = () => {
  const [expeditions, setExpeditions] = useState<IExpedition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.expeditions.list()
      .then((data) => setExpeditions(data.expeditions))
      .catch((err) => console.error('Failed to load expeditions:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-12">
        {/* Header */}
        <div className="space-y-2 pb-6 border-b border-[#0D1211]/10">
          <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase">
            Field Operations & Marine Campaigns
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#0D1211]">
            Expedition Archive
          </h1>
          <p className="text-sm sm:text-base text-[#747A75] font-light max-w-2xl">
            Chronological records of multidisciplinary scientific voyages across Antarctica, the Arctic Ocean, and the Third Pole glaciers.
          </p>
        </div>

        {/* Editorial Timeline Layout */}
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-[#747A75]">
            Loading expedition logs...
          </div>
        ) : (
          <div className="relative border-l-2 border-[#0D1211]/20 ml-4 sm:ml-6 pl-6 sm:pl-10 space-y-12">
            {expeditions.map((exp, idx) => (
              <div key={exp.slug} className="relative group">
                {/* Timeline node dot */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-5 h-5 rounded-full bg-[#0D1211] border-4 border-[#F4F2EC] group-hover:scale-125 transition-transform" />

                <div className="p-6 sm:p-8 rounded-2xl border border-[#0D1211]/15 bg-[#FAF9F5] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:border-[#0D1211] transition-all">
                  {/* Photo cover */}
                  <div className="lg:col-span-4 h-56 rounded-xl overflow-hidden">
                    <img
                      src={exp.coverImageUrl}
                      alt={exp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] font-semibold">
                          {exp.number}
                        </span>
                        <span className="text-[#747A75]">{exp.region}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                        exp.status === 'COMPLETED' ? 'bg-[#EBE8DF] text-[#747A75]' : 'bg-[#B7FF5A]/30 text-[#2E7D32]'
                      }`}>
                        {exp.status}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#0D1211] group-hover:text-[#3D7BFF] transition-colors">
                      {exp.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#747A75] font-light leading-relaxed">
                      {exp.overview}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono text-[#747A75] pt-2 border-t border-[#0D1211]/10">
                      <div>
                        <span className="text-[10px] uppercase block">Duration</span>
                        <span className="text-[#0D1211]">{exp.dates?.startDate} to {exp.dates?.endDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase block">Lead Scientist</span>
                        <span className="text-[#0D1211] truncate block">{exp.leadScientist?.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase block">Participants</span>
                        <span className="text-[#0D1211]">{exp.participantsCount} Researchers</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {exp.researchThemes?.map((theme) => (
                          <span key={theme} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F4F2EC] text-[#747A75] border border-[#0D1211]/10">
                            {theme}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/expeditions/${exp.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D1211] text-[#F4F2EC] rounded text-xs font-mono uppercase hover:bg-[#192220] transition-colors shrink-0"
                      >
                        Explore Expedition <ArrowRight className="w-3.5 h-3.5 text-[#B7FF5A]" />
                      </Link>
                    </div>
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

export default ExpeditionsPage;
