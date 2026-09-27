import React, { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { Sparkles, Calendar, MapPin, Users, ArrowRight, Award } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { IActivity } from '@oruvia/shared';

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.activities.list()
      .then((data) => setActivities(data.activities))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-12">
        <div className="space-y-2 pb-6 border-b border-[#0D1211]/10">
          <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase">
            Institutional Programs & Fieldwork
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#0D1211]">
            Institutional Activities
          </h1>
          <p className="text-sm sm:text-base text-[#747A75] font-light max-w-2xl">
            Symposia, cold-weather survival training camps, educational expos, and stakeholder workshops driving polar and cryospheric science.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-[#747A75]">Loading activities...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => (
              <div
                key={act.slug}
                className="p-6 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] flex flex-col justify-between space-y-4 hover:border-[#0D1211] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] font-semibold text-[10px]">
                      {act.category}
                    </span>
                    <span className="text-[#747A75]">{act.date}</span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[#0D1211] leading-snug">
                    {act.title}
                  </h3>

                  <p className="text-xs font-mono text-[#747A75] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {act.locationName}
                  </p>

                  <p className="text-xs text-[#747A75] font-light leading-relaxed line-clamp-3">
                    {act.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0D1211]/10 text-xs font-mono text-[#747A75]">
                  <p>Lead Coordinator: <strong className="text-[#0D1211]">{act.leadCoordinator}</strong></p>
                  {act.outcomes && act.outcomes.length > 0 && (
                    <p className="text-[11px] text-[#2E7D32] mt-1 truncate">✓ {act.outcomes[0]}</p>
                  )}
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

export default ActivitiesPage;
