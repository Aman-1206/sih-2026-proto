import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { api } from '../services/api';

const STORIES_DATA = [
  {
    slug: 'deep-ice-cores',
    title: 'What Deep Ice Cores Tell Us About Ancient Atmospheres',
    category: 'Feature',
    domain: 'Glaciology',
    readTime: '8 min read',
    date: '2025-11-12',
    excerpt: 'Drilling through time, scientists extract cylinders of ice that preserve bubbles of ancient air—direct samples of Earth\'s atmosphere from hundreds of thousands of years ago.',
    author: 'Dr. Priya Mehra',
    color: '#3D7BFF',
  },
  {
    slug: 'phytoplankton-carbon',
    title: 'The Tiny Organisms Sequestering Billions of Tons of Carbon',
    category: 'Explainer',
    domain: 'Marine Biology',
    readTime: '5 min read',
    date: '2025-10-28',
    excerpt: 'Phytoplankton, the microscopic marine plants that produce half of Earth\'s oxygen, are also critical players in the carbon cycle.',
    author: 'Dr. Arjun Sharma',
    color: '#B7FF5A',
  },
  {
    slug: 'polar-vortex-explained',
    title: 'Understanding the Polar Vortex and Its Global Influence',
    category: 'Explainer',
    domain: 'Atmospheric Science',
    readTime: '6 min read',
    date: '2025-10-05',
    excerpt: 'A weakened polar vortex sends frigid arctic air cascading south, triggering extreme cold events that affect billions.',
    author: 'Dr. Rekha Nair',
    color: '#FF6B6B',
  },
  {
    slug: 'southern-ocean-circulation',
    title: 'The Southern Ocean: Engine of Global Climate',
    category: 'Long Read',
    domain: 'Oceanography',
    readTime: '12 min read',
    date: '2025-09-20',
    excerpt: 'The world\'s most powerful ocean current circles Antarctica, distributing heat, nutrients, and CO₂ across every major ocean basin.',
    author: 'Dr. Vijay Iyer',
    color: '#FFD93D',
  },
];

export default function StoriesPage() {
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', 'Feature', 'Explainer', 'Long Read'];

  const filtered = filter === 'all' ? STORIES_DATA : STORIES_DATA.filter(s => s.category === filter);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#0D1211] text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-[#B7FF5A] rounded-full" />
            <span className="font-mono text-xs text-[#B7FF5A] uppercase tracking-widest">Science Stories</span>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl mb-6 max-w-3xl">
            Science,<br /><em>told well.</em>
          </h1>
          <p className="text-[#747A75] text-xl max-w-2xl">
            Long-form articles, explainers, and features that bring scientific discoveries to life — grounded in real data, written for everyone.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="border-b border-[#E8E4DC] bg-[#F4F2EC] sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? 'bg-[#0D1211] text-white'
                  : 'text-[#747A75] hover:text-[#0D1211]'
              }`}
            >
              {cat === 'all' ? 'All Stories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Story */}
      {filtered[0] && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="group relative bg-[#0D1211] rounded-2xl overflow-hidden p-12 md:p-16 mb-12">
            <div
              className="absolute top-0 right-0 w-1/2 h-full opacity-10"
              style={{ background: `radial-gradient(circle at 70% 50%, ${filtered[0].color}, transparent 70%)` }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-3 py-1 text-xs font-mono rounded-full"
                  style={{ backgroundColor: filtered[0].color + '20', color: filtered[0].color }}
                >
                  {filtered[0].category}
                </span>
                <span className="text-[#747A75] text-sm font-mono">{filtered[0].domain}</span>
                <span className="text-[#747A75] text-sm">·</span>
                <span className="text-[#747A75] text-sm">{filtered[0].readTime}</span>
              </div>
              <h2 className="text-white font-serif text-3xl md:text-4xl mb-4 max-w-2xl group-hover:text-[#B7FF5A] transition-colors">
                {filtered[0].title}
              </h2>
              <p className="text-[#747A75] text-lg mb-6 max-w-xl">{filtered[0].excerpt}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#747A75]">By {filtered[0].author}</span>
                <span className="text-[#747A75]">·</span>
                <span className="text-sm text-[#747A75]">{new Date(filtered[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <Link
                to={`/stories/${filtered[0].slug}`}
                className="mt-6 inline-flex items-center gap-2 font-mono text-sm"
                style={{ color: filtered[0].color }}
              >
                Read story <span>→</span>
              </Link>
            </div>
          </div>

          {/* Story Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(1).map((story) => (
              <Link
                key={story.slug}
                to={`/stories/${story.slug}`}
                className="group bg-white border border-[#E8E4DC] rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-2 py-0.5 text-xs font-mono rounded"
                    style={{ backgroundColor: story.color + '15', color: story.color }}
                  >
                    {story.category}
                  </span>
                  <span className="text-[#747A75] text-xs">{story.readTime}</span>
                </div>
                <h3 className="font-serif text-xl mb-2 group-hover:text-[#3D7BFF] transition-colors line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-[#747A75] text-sm line-clamp-3 mb-4">{story.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t border-[#E8E4DC]">
                  <span className="text-xs text-[#747A75]">{story.author}</span>
                  <span className="text-xs text-[#747A75]">{story.domain}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
