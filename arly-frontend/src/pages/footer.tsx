import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-dashed border-black/20 dark:border-white/20 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-sm font-black tracking-tight text-black dark:text-white">
              ARLY
            </h2>
            <p className="text-xs text-black/40 dark:text-white/40 mt-1 max-w-xs">
              Paste a product link, get back clean pricing, stock, and spec data.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-1">
                Product
              </span>
              <Link to="/" className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">
                About
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-1">
                Legal
              </span>
              <span className="text-black/30 dark:text-white/30 text-sm cursor-not-allowed select-none">
                Privacy
              </span>
              <span className="text-black/30 dark:text-white/30 text-sm cursor-not-allowed select-none">
                Terms
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-1">
                Contact
              </span>
              <div className="flex gap-2">
                <a
                  href="mailto:hello@arly.app"
                  aria-label="Email ARLY"
                  title="hello@arly.app"
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:text-white dark:hover:text-black hover:bg-[#D98E1B] dark:hover:bg-[#D98E1B] hover:scale-110 hover:border-[#D98E1B] transition-all duration-200"
                >
                  <Mail size={16} />
                </a>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ARLY on GitHub"
                  title="GitHub"
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:text-white dark:hover:text-black hover:bg-[#D98E1B] dark:hover:bg-[#D98E1B] hover:scale-110 hover:border-[#D98E1B] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <GithubIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dashed border-black/10 dark:border-white/10 mt-8 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-black/40 dark:text-white/40">
          <p>© {new Date().getFullYear()} ARLY. All rights reserved.</p>
          <p>Built with care.</p>
        </div>
      </div>
    </footer>
  );
}