import { Link, useLocation } from 'wouter';
import { useAuthStore } from '../../stores/authStore';
import { UploadWizard } from '../../components/studio/UploadWizard';

export default function StudioUploadPage() {
  const { user } = useAuthStore();
  const [, setLocation] = useLocation();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="font-serif text-2xl mb-2">Authentication required</h2>
          <button
            onClick={() => setLocation('/login')}
            className="text-[#3D7BFF] hover:underline"
          >
            Sign in to upload content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EC]">
      {/* Header */}
      <div className="bg-[#0D1211] text-white py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/studio" className="text-[#747A75] hover:text-white transition-colors font-mono text-xs">
              ← Studio
            </Link>
            <span className="text-[#747A75]">/</span>
            <span className="font-mono text-xs text-[#B7FF5A]">Upload</span>
          </div>
          <h1 className="font-serif text-3xl">Upload Scientific Content</h1>
          <p className="text-[#747A75] mt-1">
            AI-assisted metadata extraction and review workflow
          </p>
        </div>
      </div>

      {/* Wizard */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <UploadWizard />
      </div>
    </div>
  );
}
