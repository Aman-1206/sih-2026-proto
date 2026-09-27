import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, X, FileText, Download } from 'lucide-react';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  citations: {
    plainText: string;
    bibtex: string;
    ris: string;
    json: string;
    jsonLd?: string;
  };
}

export const CitationModal: React.FC<CitationModalProps> = ({
  isOpen,
  onClose,
  title,
  citations,
}) => {
  const [activeTab, setActiveTab] = useState<'plainText' | 'bibtex' | 'ris' | 'json' | 'jsonLd'>('plainText');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentContent = citations[activeTab] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      plainText: 'txt',
      bibtex: 'bib',
      ris: 'ris',
      json: 'json',
      jsonLd: 'jsonld',
    };
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `citation_${activeTab}.${extensions[activeTab] || 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0D1211]/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-[#FAF9F5] border border-[#0D1211]/20 rounded-xl shadow-2xl p-6 z-10 space-y-4"
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#0D1211]/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#747A75]">
              Citation Exporter
            </span>
            <h3 className="font-serif text-xl font-medium text-[#0D1211] mt-0.5 line-clamp-1">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#747A75] hover:text-[#0D1211] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-[#0D1211]/10 pb-2">
          {[
            { id: 'plainText', label: 'Plain Text (APA/ISO)' },
            { id: 'bibtex', label: 'BibTeX' },
            { id: 'ris', label: 'RIS (EndNote/Zotero)' },
            { id: 'json', label: 'JSON Schema' },
            { id: 'jsonLd', label: 'Schema.org JSON-LD' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0D1211] text-[#F4F2EC]'
                  : 'bg-[#F4F2EC] text-[#747A75] hover:text-[#0D1211]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Box */}
        <div className="relative bg-[#0D1211] text-[#F4F2EC] p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-60">
          <pre className="whitespace-pre-wrap">{currentContent}</pre>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-[#747A75]">
            FAIR Data Compliance & Open Access
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg border border-[#0D1211]/20 text-xs font-mono flex items-center gap-1.5 hover:bg-[#EBE8DF] transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-lg bg-[#0D1211] text-[#F4F2EC] text-xs font-mono flex items-center gap-1.5 hover:bg-[#192220] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#B7FF5A]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard' : 'Copy Citation'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
