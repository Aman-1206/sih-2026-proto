import React, { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { Radio, MapPin, Calendar, Activity, Wind, Thermometer, Gauge, ArrowRight, ExternalLink } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { DataVisualizer } from '../components/visualizers/DataVisualizer';
import { api } from '../services/api';
import { IStation, IDataset } from '@oruvia/shared';

export const StationsPage: React.FC = () => {
  const [stations, setStations] = useState<IStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stations.list()
      .then((data) => setStations(data.stations))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-12">
        <div className="space-y-2 pb-6 border-b border-[#0D1211]/10">
          <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase">
            Planetary Outposts & Sensor Posts
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#0D1211]">
            Live Research Stations
          </h1>
          <p className="text-sm sm:text-base text-[#747A75] font-light max-w-2xl">
            Continuous meteorological and geophysical monitoring observatories situated in East Antarctica, Svalbard, and the High Himalayas.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-[#747A75]">Loading polar stations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stations.map((s) => (
              <div
                key={s.slug}
                className="p-6 sm:p-8 rounded-2xl border border-[#0D1211]/15 bg-[#FAF9F5] flex flex-col justify-between space-y-6 hover:border-[#0D1211] transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] font-semibold">
                      {s.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/30 font-semibold">
                      DEMO TELEMETRY
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#0D1211] group-hover:text-[#3D7BFF] transition-colors">
                    {s.name}
                  </h2>

                  <p className="text-xs font-mono text-[#747A75]">
                    {s.region} · Established {s.establishedYear} · Elevation: {s.coordinates?.elevationMeters}m
                  </p>

                  <p className="text-xs sm:text-sm text-[#747A75] font-light leading-relaxed">
                    {s.description}
                  </p>

                  {/* Current Observations Card */}
                  {s.currentObservations && (
                    <div className="p-4 bg-[#F4F2EC] rounded-xl border border-[#0D1211]/10 grid grid-cols-3 gap-2 font-mono text-xs text-center">
                      <div className="p-2 bg-white/70 rounded-lg">
                        <span className="text-[10px] text-[#747A75] block uppercase">Temperature</span>
                        <span className="text-base font-bold text-[#0D1211]">{s.currentObservations.temperatureC}°C</span>
                      </div>
                      <div className="p-2 bg-white/70 rounded-lg">
                        <span className="text-[10px] text-[#747A75] block uppercase">Wind Speed</span>
                        <span className="text-base font-bold text-[#0D1211]">{s.currentObservations.windSpeedKts} kts</span>
                      </div>
                      <div className="p-2 bg-white/70 rounded-lg">
                        <span className="text-[10px] text-[#747A75] block uppercase">Pressure</span>
                        <span className="text-base font-bold text-[#0D1211]">{s.currentObservations.pressureHpa} hPa</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#0D1211]/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {s.researchThemes?.map((theme) => (
                      <span key={theme} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#EBE8DF] text-[#747A75]">
                        {theme}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/stations/${s.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D1211] text-[#F4F2EC] rounded text-xs font-mono uppercase hover:bg-[#192220] transition-colors shrink-0"
                  >
                    Station Telemetry →
                  </Link>
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

export const StationDetailPage: React.FC = () => {
  const [, params] = useRoute('/stations/:slug');
  const slug = params?.slug || '';

  const [station, setStation] = useState<IStation | null>(null);
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.stations.getBySlug(slug)
      .then((data) => {
        setStation(data.station);
        setDatasets(data.datasets || []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center font-mono text-xs text-[#747A75]">Loading station...</div>;
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex flex-col justify-between">
        <Navbar />
        <main className="max-w-4xl mx-auto py-32 px-6 text-center space-y-4">
          <h1 className="font-serif text-3xl">Station Not Found</h1>
          <Link href="/stations" className="px-4 py-2 bg-[#0D1211] text-[#F4F2EC] rounded font-mono text-xs uppercase inline-block">Back to Stations</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-12">
        <div className="flex items-center justify-between pb-4 border-b border-[#0D1211]/10 text-xs font-mono text-[#747A75]">
          <div className="flex items-center gap-2">
            <Link href="/stations" className="hover:text-[#0D1211]">Stations</Link>
            <span>/</span>
            <span className="text-[#0D1211] font-semibold">{station.code}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-[#E5A93C]/20 text-[#E5A93C] font-semibold border border-[#E5A93C]/30">
            DEMO TELEMETRY ACTIVE
          </span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] font-semibold">{station.code}</span>
              <span className="text-[#747A75]">{station.region}</span>
              <span className="px-2 py-0.5 rounded bg-[#2E7D32]/20 text-[#2E7D32] text-[10px]">{station.operationalStatus}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0D1211]">{station.name}</h1>
            <p className="text-sm sm:text-base text-[#747A75] font-light leading-relaxed">{station.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#747A75] uppercase block">Coordinates</span>
                <span className="text-[#0D1211]">{station.coordinates?.latitude}°N, {station.coordinates?.longitude}°E</span>
              </div>
              <div>
                <span className="text-[10px] text-[#747A75] uppercase block">Established</span>
                <span className="text-[#0D1211]">{station.establishedYear}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#747A75] uppercase block">Elevation</span>
                <span className="text-[#0D1211]">{station.coordinates?.elevationMeters}m a.s.l.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 h-80 rounded-2xl overflow-hidden border border-[#0D1211]/15">
            <img src={station.photos?.[0] || 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80'} alt={station.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Live Weather Visualization */}
        <section className="space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#747A75]">
            Station Meteorological Observations
          </span>
          <DataVisualizer
            title={`${station.name} Continuous Weather Series`}
            isDemoData={station.isDemoData}
          />
        </section>

        {/* Associated Datasets */}
        {datasets.length > 0 && (
          <section className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#747A75]">
              Datasets Collected at {station.name}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datasets.map((d) => (
                <Link
                  key={d.slug}
                  href={`/datasets/${d.slug}`}
                  className="p-5 rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] hover:border-[#0D1211] transition-all space-y-2 group"
                >
                  <span className="text-xs font-mono text-[#3D7BFF]">Level {d.processingLevel}</span>
                  <h4 className="font-serif text-lg font-medium text-[#0D1211] group-hover:text-[#3D7BFF] transition-colors">{d.title}</h4>
                  <p className="text-xs text-[#747A75] font-light line-clamp-2">{d.abstract}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StationsPage;
