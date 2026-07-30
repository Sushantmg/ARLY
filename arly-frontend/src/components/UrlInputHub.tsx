import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface UrlInputHubProps {
  onUrlSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInputHub({ onUrlSubmit, isLoading }: UrlInputHubProps) {
  const [urlInput, setUrlInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!urlInput.trim() || !urlInput.startsWith('http')) {
      setError('Paste a full product link starting with http:// or https://');
      return;
    }

    setError('');
    onUrlSubmit(urlInput);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <span
        className="inline-flex items-center gap-2 rounded-full bg-[#21365E]/5 dark:bg-blue-300/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#21365E] dark:text-blue-300 uppercase mb-5"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <Link className="text-[#D98E1B]" size={14} /> Step 1 of 5 — paste a link
      </span>

      <h1
        className="text-5xl sm:text-6xl font-black text-[#16181F] dark:text-white tracking-tight mb-3 leading-[1.05]"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        ARLY
      </h1>
      <p className="text-lg text-[#5B6270] dark:text-white/60 font-medium mb-8 max-w-lg mx-auto">
        Drop in one Nepali product link. ARLY reads it, then checks it against
        10+ other local retailers so you don't have to.
      </p>

      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl shadow-[0_20px_50px_-20px_rgba(22,24,31,0.25)] bg-white dark:bg-[#12101f]/70 p-2 border border-[#16181F]/10 dark:border-white/10"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5B6270]/50" />
            <input
              type="text"
              className={`block w-full rounded-xl border-0 py-4 pl-11 pr-4 text-[#16181F] dark:text-white/90 placeholder:text-[#5B6270]/50 focus:ring-2 focus:ring-inset focus:ring-[#21365E] text-sm bg-[#FBFAF6] dark:bg-white/5 outline-none transition-all ${
                error ? 'ring-2 ring-[#B23A48] focus:ring-[#B23A48] bg-[#B23A48]/5' : ''
              }`}
              placeholder="https://daraz.com.np/products/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={isLoading}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="group rounded-xl bg-[#16181F] px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-[#21365E] disabled:bg-[#16181F]/50 transition-all whitespace-nowrap"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Extracting…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Extract product
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </button>
        </div>
      </form>
      {error && (
        <p className="mt-3 text-sm text-[#B23A48] text-left pl-2 font-medium flex items-center gap-1.5">
          <AlertCircle size={16} /> {error}
        </p>
      )}
    </div>
  );
}