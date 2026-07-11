export default function About() {
  return (
    <div className="max-w-3xl mx-auto pt-12 pb-6 px-4">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 sm:p-10">
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-4">
          Project Overview
        </span>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">
          About the ARLY Engine
        </h1>
        <p className="text-base text-gray-600 leading-relaxed mb-6">
          ARLY is an intelligent e-commerce data extraction utility designed to scrape, track, and monitor changing item values across retail marketplaces. By parsing structural elements from target product URLs, our stack normalizes raw data payloads into unified pricing dashboards.
        </p>
        
        <div className="border-t border-gray-100 pt-6 mt-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Core Stack Architecture</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-medium text-gray-400">Frontend Engine</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">Vite + React 18</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-medium text-gray-400">Type Integrity</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">TypeScript</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-medium text-gray-400">Interface Styling</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">Tailwind CSS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}