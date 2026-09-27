import React, { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { Image as ImageIcon, Video, Filter, Search, ArrowRight, Eye } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { IMediaAsset } from '@oruvia/shared';

export const MediaArchivePage: React.FC = () => {
  const [media, setMedia] = useState<IMediaAsset[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    setLoading(true);
    api.media.list({ type: selectedType || undefined })
      .then((data) => {
        setMedia(data.media);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [selectedType]);

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-8">
        {/* Header */}
        <div className="space-y-2 pb-6 border-b border-[#0D1211]/10">
          <span className="text-xs font-mono tracking-widest text-[#747A75] uppercase">
            Visual & Sensory Repository
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#0D1211]">
            Media Archive
          </h1>
          <p className="text-sm sm:text-base text-[#747A75] font-light max-w-2xl">
            Calibrated field photography, glacier time-lapse video captures, and acoustic sensor records from polar and alpine deployments.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex gap-2">
          {['', 'PHOTO', 'VIDEO', 'INFOGRAPHIC'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                selectedType === t
                  ? 'bg-[#0D1211] text-[#F4F2EC]'
                  : 'bg-[#FAF9F5] text-[#747A75] border border-[#0D1211]/10 hover:border-[#0D1211]'
              }`}
            >
              {t || 'All Media'}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Gallery */}
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-[#747A75]">
            Loading visual archive records...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((asset) => (
              <Link
                key={asset._id}
                href={`/media/${asset._id}`}
                className="group rounded-xl border border-[#0D1211]/15 bg-[#FAF9F5] overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={asset.thumbnailUrl || asset.url}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#0D1211]/80 backdrop-blur-sm text-[10px] font-mono text-[#B7FF5A] uppercase">
                    {asset.mediaType}
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#0D1211] line-clamp-1">{asset.title}</h3>
                    <p className="text-xs text-[#747A75] font-mono">{asset.region} · {asset.dateCaptured}</p>
                    <p className="text-xs text-[#747A75] font-light mt-1 line-clamp-2">{asset.caption}</p>
                  </div>
                  <div className="pt-2 border-t border-[#0D1211]/10 flex justify-between items-center text-xs font-mono text-[#747A75]">
                    <span>By {asset.photographerOrCreator}</span>
                    <span className="text-[#0D1211] group-hover:underline">Inspect →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export const MediaDetailPage: React.FC = () => {
  const [, params] = useRoute('/media/:id');
  const id = params?.id || '';

  const [asset, setAsset] = useState<IMediaAsset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.media.getById(id)
      .then((data) => setAsset(data.asset))
      .catch((err) => console.error('Failed to load media detail:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center font-mono text-xs text-[#747A75]">Loading media...</div>;
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex flex-col justify-between">
        <Navbar />
        <main className="max-w-4xl mx-auto py-32 px-6 text-center space-y-4">
          <h1 className="font-serif text-3xl">Media Not Found</h1>
          <Link href="/media" className="px-4 py-2 bg-[#0D1211] text-[#F4F2EC] rounded font-mono text-xs uppercase inline-block">Back to Media</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col justify-between">
      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-24 w-full space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#0D1211]/10 text-xs font-mono text-[#747A75]">
          <div className="flex items-center gap-2">
            <Link href="/media" className="hover:text-[#0D1211]">Media Archive</Link>
            <span>/</span>
            <span className="text-[#0D1211] font-semibold">{asset.mediaType}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Visual */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[#0D1211]/15 bg-[#0D1211]">
            <img src={asset.url} alt={asset.title} className="w-full h-auto max-h-[600px] object-contain mx-auto" />
          </div>

          {/* Metadata Inspector Panel */}
          <div className="lg:col-span-4 p-6 rounded-2xl border border-[#0D1211]/15 bg-[#FAF9F5] space-y-4 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] uppercase text-[10px] font-semibold">
              {asset.mediaType} RECORD
            </span>

            <h2 className="font-serif text-2xl font-medium text-[#0D1211] leading-snug">{asset.title}</h2>
            <p className="text-[#747A75] font-sans font-light leading-relaxed">{asset.caption}</p>

            <div className="space-y-2 pt-3 border-t border-[#0D1211]/10 text-[#747A75]">
              <p>Creator / Photographer: <strong className="text-[#0D1211]">{asset.photographerOrCreator}</strong></p>
              <p>Date Captured: <strong className="text-[#0D1211]">{asset.dateCaptured}</strong></p>
              <p>Region: <strong className="text-[#0D1211]">{asset.region}</strong></p>
              {asset.coordinates && (
                <p>Coordinates: <strong className="text-[#0D1211]">{asset.coordinates.latitude}°N, {asset.coordinates.longitude}°E</strong></p>
              )}
              <p>Copyright & License: <strong className="text-[#0D1211]">{asset.license}</strong></p>
            </div>

            {asset.tags && (
              <div className="pt-2 border-t border-[#0D1211]/10 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#747A75]">Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-[#F4F2EC] text-[#0D1211] border border-[#0D1211]/10 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MediaArchivePage;
