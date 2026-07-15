import PageTransition from '../components/PageTransition';

export default function About() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto pt-12 pb-6 px-4">
        <div className="bg-white dark:bg-[#12101f]/70 border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl p-8 sm:p-10">
          <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 mb-4">
            Project Overview
          </span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            About the ARLY Engine
          </h1>
          <p className="text-base text-gray-600 dark:text-white/60 leading-relaxed mb-6">
            ARLY is an intelligent e-commerce data extraction utility designed to scrape, track, and monitor changing item values across retail marketplaces. By parsing structural elements from target product URLs, our stack normalizes raw data payloads into unified pricing dashboards.
          </p>
          
          <div className="border-t border-gray-100 dark:border-white/10 pt-6 mt-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Core Stack Architecture</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                <p className="text-xs font-medium text-gray-400 dark:text-white/40">Frontend Engine</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white/90 mt-0.5">Vite + React 18</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                <p className="text-xs font-medium text-gray-400 dark:text-white/40">Type Integrity</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white/90 mt-0.5">TypeScript</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                <p className="text-xs font-medium text-gray-400 dark:text-white/40">Interface Styling</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white/90 mt-0.5">Tailwind CSS</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-white/10 pt-6 mt-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Project Members</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center mx-auto mb-2">UR</div>
                <p className="text-sm font-bold text-gray-800 dark:text-white/90">Ujwal Rana</p>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">6th Sem Software Engineering</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center mx-auto mb-2">ST</div>
                <p className="text-sm font-bold text-gray-800 dark:text-white/90">Sushan Tamang</p>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">6th Sem Software Engineering</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center mx-auto mb-2">AT</div>
                <p className="text-sm font-bold text-gray-800 dark:text-white/90">Anmol Tamang</p>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">6th Sem Software Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}