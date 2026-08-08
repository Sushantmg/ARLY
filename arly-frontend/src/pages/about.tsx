import { Link } from 'react-router-dom';
import { Link2, Scale, History as HistoryIcon, ShieldCheck, Search, Database, Store, Globe, Cpu, ArrowRight, Sparkles } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import WorkflowSimulation from '../components/WorkflowSimulation';

const features = [
  {
    icon: Link2,
    title: 'Link-Based Extraction',
    desc: 'Paste any product URL. ARLY parses structured data (JSON-LD, Open Graph, DOM fallback) or uses an LLM to reconstruct the full product profile.',
  },
  {
    icon: Scale,
    title: 'Cross-Store Comparison',
    desc: 'Generated search queries fan out across Nepali retailers, cluster same-product matches, and rank them to surface the best price.',
  },
  {
    icon: HistoryIcon,
    title: 'Scrape History',
    desc: 'Every scrape is saved per account in Supabase with row-level security, so you can revisit, re-scrape, or open any past product.',
  },
  {
    icon: Search,
    title: 'Catalog Lookup',
    desc: 'A cached product catalog with tiered matching — exact variants, closest matches, and similar alternatives with live price confirmation.',
  },
  {
    icon: ShieldCheck,
    title: 'Auth & Admin',
    desc: 'Email/password plus Google OAuth via Supabase, with an admin dashboard gated by role for monitoring usage.',
  },
  {
    icon: Globe,
    title: 'Built for Nepal',
    desc: 'NPR pricing, local marketplaces, Cloudflare-aware fetching, and domain allowlisting tuned for Nepali e-commerce.',
  },
];

const steps = [
  { num: '01', title: 'Paste a link', desc: 'One URL is all you need — validation happens instantly on the landing page.' },
  { num: '02', title: 'Extract the product', desc: 'JSON-LD → Open Graph → DOM → LLM fallback reconstructs name, price, specs, and image.' },
  { num: '03', title: 'Compare across stores', desc: 'LLM-built queries search BrotherMart, OlizStore, GBN Store, and Daraz; results are normalized and ranked.' },
];

const stack = [
  { layer: 'Frontend Engine', tech: 'React 19 + Vite 8' },
  { layer: 'Type Integrity', tech: 'TypeScript' },
  { layer: 'Interface Styling', tech: 'Tailwind CSS v4' },
  { layer: 'Auth & Database', tech: 'Next.js 16 + Supabase' },
  { layer: 'Scraping Runtime', tech: 'Express + Playwright' },
  { layer: 'LLM Pipeline', tech: 'Groq (extract & compare)' },
];

const retailers = ['BrotherMart', 'OlizStore', 'GBN Store', 'Daraz'];

const members = [
  { initials: 'UR', name: 'Ujwal Rana', role: '6th Sem Software Engineering' },
  { initials: 'ST', name: 'Sushan Tamang', role: '6th Sem Software Engineering' },
  { initials: 'AT', name: 'Anmol Tamang', role: '6th Sem Software Engineering' },
];

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6">
      <span className="text-xs font-semibold text-[#D98E1B] uppercase tracking-widest">{kicker}</span>
      <h2
        className="text-2xl sm:text-3xl font-black text-[#16181F] dark:text-white tracking-tight mt-1"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

export default function About() {
  return (
    <PageTransition>
      <WorkflowSimulation />
      <div className="max-w-5xl mx-auto pt-12 pb-6 px-4">
        {/* Intro */}
        <div className="bg-white/60 dark:bg-[#12101f]/70 border border-[#16181F]/8 dark:border-white/10 rounded-2xl shadow-xl p-8 sm:p-12">
          <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 mb-4">
            Project Overview
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black text-[#16181F] dark:text-white tracking-tight mb-4"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            About the ARLY Engine
          </h1>
          <p className="text-base text-gray-600 dark:text-white/60 leading-relaxed mb-3">
            ARLY is a Nepali retail price-intelligence engine. Paste a single product link and it
            extracts the item's structured details, cross-checks local marketplaces, and tells you
            the cheapest place to buy it — all in a few seconds.
          </p>
          <p className="text-base text-gray-600 dark:text-white/60 leading-relaxed">
            Under the hood it runs a three-service pipeline: a React frontend, a Next.js + Supabase
            auth backend, and two Express scrapers powered by an LLM for extraction and ranking.
          </p>
        </div>

        {/* Features */}
        <div className="mt-12">
          <SectionHeader kicker="Capabilities" title="What ARLY does" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#16181F]/8 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D98E1B]/10 text-[#D98E1B] mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">{title}</h3>
                <p className="text-sm text-[#5B6270] dark:text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12">
          <SectionHeader kicker="Pipeline" title="How it works" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map(({ num, title, desc }) => (
              <div
                key={num}
                className="flex gap-4 rounded-2xl border border-[#16181F]/8 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6"
              >
                <span
                  className="text-2xl font-black text-[#D98E1B] shrink-0"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {num}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                  <p className="text-sm text-[#5B6270] dark:text-white/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core stack */}
        <div className="mt-12">
          <SectionHeader kicker="Technology" title="Core stack" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stack.map(({ layer, tech }) => (
              <div
                key={layer}
                className="p-4 bg-white/60 dark:bg-white/5 rounded-2xl border border-[#16181F]/8 dark:border-white/10"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Cpu size={12} className="text-[#D98E1B]" />
                  <p className="text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">{layer}</p>
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-white/90">{tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Retailers */}
        <div className="mt-12">
          <SectionHeader kicker="Coverage" title="Retailers we check" />
          <div className="flex flex-wrap gap-3">
            {retailers.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 dark:bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-700 dark:text-violet-400 ring-1 ring-inset ring-violet-700/10"
              >
                <Store size={13} />
                {r}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 dark:bg-white/5 px-4 py-2 text-sm font-semibold text-gray-500 dark:text-white/50 ring-1 ring-inset ring-gray-200 dark:ring-white/10">
              <Database size={13} />
              + query-based search
            </span>
          </div>
        </div>

        {/* Members */}
        <div className="mt-12">
          <SectionHeader kicker="Team" title="Project members" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {members.map(({ initials, name, role }) => (
              <div
                key={name}
                className="p-5 bg-white/60 dark:bg-white/5 rounded-2xl border border-[#16181F]/8 dark:border-white/10 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                  {initials}
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-white/90">{name}</p>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all"
          >
            <Sparkles size={15} />
            Try scraping a product
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
