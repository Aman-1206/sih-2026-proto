import { Link } from 'wouter';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Giant 404 */}
        <div className="font-mono text-[180px] font-bold leading-none text-[#E8E4DC] select-none mb-4">
          404
        </div>
        <div className="relative -mt-20 mb-8">
          <div className="w-16 h-16 bg-[#B7FF5A] rounded-full mx-auto flex items-center justify-center">
            <span className="text-2xl">🔭</span>
          </div>
        </div>
        <h1 className="font-serif text-3xl mb-3">Page not found</h1>
        <p className="text-[#747A75] mb-8 leading-relaxed">
          This coordinate doesn't appear on our scientific atlas. The page may have been moved, 
          renamed, or removed from the knowledge repository.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-[#0D1211] text-white rounded-lg font-medium hover:bg-[#1a2320] transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/explore"
            className="px-6 py-3 border border-[#0D1211] text-[#0D1211] rounded-lg font-medium hover:bg-[#0D1211] hover:text-white transition-colors"
          >
            Explore Content
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-[#E8E4DC]">
          <p className="text-xs font-mono text-[#747A75] uppercase tracking-widest mb-4">Popular pages</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: '/datasets', label: 'Datasets' },
              { to: '/expeditions', label: 'Expeditions' },
              { to: '/publications', label: 'Publications' },
              { to: '/atlas', label: 'Atlas' },
              { to: '/ask', label: 'Ask ORUVIA' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-1.5 text-sm border border-[#E8E4DC] rounded-full text-[#747A75] hover:border-[#0D1211] hover:text-[#0D1211] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
