import { Link } from "react-router-dom";

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
              <Link to="/privacy" className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">
                Terms
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-1">
                Contact
              </span>
              <a href="mailto:hello@arly.app" className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">
                hello@arly.app
              </a>
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">
                GitHub
              </a>
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