import { useEffect, useState, type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Globe, ScanSearch, Store, Sparkles, Check, ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type State = 'idle' | 'active' | 'done';

const LOG_LINES = [
  'vite → POST /api/ · url in → query_scrapper:3002',
  'query_scrapper · scrapeUrl() → render + extract',
  '  → json-ld · schema.org hit ✓',
  '  → og-meta · og:price fallback ✓',
  '  → dom-fallback · selector parse ✓',
  '  → llm · llama-3.1-8b-instant normalize ✓',
  '  → buildSearchQueries() · [specific, broad]',
  'vite → POST /compare-api/compare · queries out',
  'product_scrapper · daraz.com.np ✓ (24)',
  '  → olizstore.com ✓ (18)',
  '  → brothermart.com ✓ (12)',
  '  → gbnstore.com.np ✓ (9)',
  'llm · filter + sort 4 stores → cheapest + alternatives',
  '→ 200 OK · results rendered',
];

const METHODS = ['json-ld', 'og-meta', 'dom-fallback', 'llm'];
const STORES = ['Daraz', 'OlizStore', 'BrotherMart', 'GBN Store'];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function FlowConnector({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="md:hidden flex flex-col items-center justify-center h-8">
        <div className="relative w-px flex-1 bg-[#16181F]/15 dark:bg-white/15">
          {active && <span className="flow-dot-v absolute -left-[3px] top-0 h-1.5 w-1.5 rounded-full bg-[#D98E1B]" />}
        </div>
      </div>
      <div className="hidden md:flex items-center flex-1 min-w-10 px-1">
        <div className="relative h-px w-full bg-[#16181F]/15 dark:bg-white/15">
          {active && <span className="flow-dot absolute top-1/2 -translate-y-1/2 left-0 h-1.5 w-1.5 rounded-full bg-[#D98E1B]" />}
        </div>
      </div>
    </div>
  );
}

interface FlowBlockProps {
  icon: LucideIcon;
  label: string;
  port: string;
  state: State;
  children?: ReactNode;
}

function FlowBlock({ icon: Icon, label, port, state, children }: FlowBlockProps) {
  const active = state === 'active';
  const done = state === 'done';
  return (
    <div
      className={[
        'relative rounded-2xl border p-3 sm:p-4 transition-all duration-300 flex-1 min-w-0',
        active
          ? 'border-[#D98E1B] bg-white dark:bg-[#12101f]/80 shadow-[0_0_0_1px_#D98E1B,0_16px_40px_-16px_rgba(217,142,27,0.5)]'
          : done
            ? 'border-[#D98E1B]/30 bg-white/60 dark:bg-[#12101f]/40'
            : 'border-[#16181F]/10 dark:border-white/10 bg-white/40 dark:bg-[#12101f]/40 opacity-70',
      ].join(' ')}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className={[
            'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300',
            active
              ? 'bg-[#D98E1B] text-[#16181F]'
              : done
                ? 'bg-[#D98E1B]/20 text-[#D98E1B]'
                : 'bg-[#16181F]/5 dark:bg-white/10 text-[#5B6270] dark:text-white/50',
          ].join(' ')}
        >
          <Icon size={18} />
          {done && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#D98E1B] text-[#16181F]">
              <Check size={11} strokeWidth={3} />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p
            className="text-[10px] font-semibold tracking-widest uppercase text-[#5B6270] dark:text-white/50"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {label}
          </p>
          <p className="text-sm font-bold text-[#16181F] dark:text-white truncate">{port}</p>
        </div>
        <span
          className={[
            'ml-auto h-2 w-2 rounded-full transition-colors duration-300',
            active ? 'bg-[#D98E1B] animate-pulse' : done ? 'bg-[#D98E1B]/60' : 'bg-[#16181F]/15 dark:bg-white/15',
          ].join(' ')}
        />
      </div>
      {children}
    </div>
  );
}

interface ChipProps {
  text: string;
  state: State;
  i: number;
}

function MethodChip({ text, state, i }: ChipProps) {
  const active = state === 'active';
  const done = state === 'done';
  return (
    <motion.span
      key={`${text}-${i}`}
      initial={false}
      animate={active ? { scale: 1.04 } : { scale: 1 }}
      className={[
        'flex items-center gap-1.5 rounded-lg border px-1.5 py-1 text-[10px] font-semibold transition-colors duration-300',
        active
          ? 'border-[#D98E1B] bg-[#D98E1B]/10 text-[#D98E1B]'
          : done
            ? 'border-[#D98E1B]/25 bg-[#D98E1B]/5 text-[#D98E1B]/70'
            : 'border-[#16181F]/10 dark:border-white/10 text-[#5B6270] dark:text-white/40',
      ].join(' ')}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {done && <Check size={9} strokeWidth={3} />}
      {text}
    </motion.span>
  );
}

function StoreChip({ text, state, i }: ChipProps) {
  const active = state === 'active';
  const done = state === 'done';
  return (
    <motion.div
      key={`${text}-${i}`}
      initial={false}
      animate={active ? { scale: 1.05 } : { scale: 1 }}
      className={[
        'flex items-center gap-1.5 rounded-xl border px-2 py-1.5 text-xs font-bold transition-colors duration-300 whitespace-nowrap',
        active
          ? 'border-[#D98E1B] bg-[#D98E1B] text-[#16181F] shadow-[0_8px_24px_-8px_rgba(217,142,27,0.6)]'
          : done
            ? 'border-[#D98E1B]/30 bg-[#D98E1B]/10 text-[#D98E1B]'
            : 'border-[#16181F]/10 dark:border-white/10 text-[#5B6270] dark:text-white/50',
      ].join(' ')}
    >
      {done ? <Check size={11} strokeWidth={3} /> : active ? <span className="h-1.5 w-1.5 rounded-full bg-[#16181F] animate-pulse" /> : <span className="h-1.5 w-1.5 rounded-full bg-[#16181F]/20 dark:bg-white/20" />}
      {text}
    </motion.div>
  );
}

export default function WorkflowSimulation() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStage((s) => (s + 1) % LOG_LINES.length), 850);
    return () => clearInterval(id);
  }, []);

  const st = (start: number, end: number): State => {
    if (stage > end) return 'done';
    if (stage >= start) return 'active';
    return 'idle';
  };

  const methodState = (i: number): State => st(i + 2, i + 2);
  const storeState = (i: number): State => st(i + 8, i + 8);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="text-center mb-10"
      >
        <span
          className="text-xs font-semibold tracking-widest uppercase text-[#D98E1B]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Under the hood
        </span>
        <h2
          className="text-3xl sm:text-4xl font-black text-[#16181F] dark:text-white mt-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          One link, three services
        </h2>
        <p className="text-base text-[#5B6270] dark:text-white/60 max-w-xl mx-auto mt-3 leading-relaxed">
          Watch a simulated request travel through the ARLY engine — extraction,
          fan-out search, and the LLM verdict.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="rounded-2xl border border-[#16181F]/10 dark:border-white/10 bg-white/70 dark:bg-[#12101f]/60 backdrop-blur p-5 sm:p-7"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2">
          <FlowBlock icon={Globe} label="Frontend" port="Vite SPA · :5173" state={st(0, 0)} />
          <FlowConnector active={stage >= 1 && stage <= 6} />
          <FlowBlock icon={ScanSearch} label="Query Scraper" port=":3002 · URL → product" state={st(1, 6)}>
            <div className="flex flex-wrap gap-1.5">
              {METHODS.map((m, i) => (
                <MethodChip key={m} text={m} state={methodState(i)} i={i} />
              ))}
            </div>
          </FlowBlock>
          <FlowConnector active={stage >= 7 && stage <= 11} />
          <FlowBlock icon={Store} label="Product Scraper" port=":3001 · fan-out search" state={st(7, 11)}>
            <div className="grid grid-cols-2 gap-1.5">
              {STORES.map((s, i) => (
                <StoreChip key={s} text={s} state={storeState(i)} i={i} />
              ))}
            </div>
          </FlowBlock>
          <FlowConnector active={stage >= 12} />
          <FlowBlock icon={Sparkles} label="Product Filtering & Sorting" port="cheapest + alternatives" state={st(12, 12)} />
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-[#16181F]/10 dark:border-white/10 bg-[#0A0C10] dark:bg-black/60 px-4 py-3">
          <p
            className="text-xs sm:text-sm text-[#FBFAF6]/90 truncate"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="text-[#D98E1B]">$</span>{' '}
            {LOG_LINES[Math.min(stage, LOG_LINES.length - 1)]}
          </p>
          <motion.span
            key={stage}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="shrink-0 ml-3 flex items-center gap-1 text-[10px] font-semibold text-[#FBFAF6]/60"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {Math.floor(stage / (LOG_LINES.length - 1) * 100)}% <ArrowRight size={10} className="text-[#D98E1B]" />
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}
