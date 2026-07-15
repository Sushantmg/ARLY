import { motion, type Variants } from 'framer-motion';
import { FiMonitor, FiServer, FiCpu, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const layers = [
  {
    icon: FiMonitor,
    name: 'Client',
    detail: 'React + TypeScript, Tailwind CSS, Framer Motion',
  },
  {
    icon: FiServer,
    name: 'Scraper service',
    detail: 'Fetches & parses the source product page',
  },
  {
    icon: FiCpu,
    name: 'LLM layer',
    detail: 'Normalizes data, then ranks & summarizes matches',
  },
  {
    icon: FiShoppingBag,
    name: '10+ retailers',
    detail: 'Daraz, SastoDeal, Hamrobazaar & other NP stores',
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const tree = `arly/
├─ client/            # React + TS homepage & results UI
│  ├─ components/      home, UrlInputHub, ResultCard
│  └─ pages/           Home.tsx, Result.tsx
├─ scraper/           # source-page extraction
│  └─ adapters/        one parser per retailer
├─ llm/               # prompt + schema layer
│  ├─ normalize.ts      raw HTML -> structured product
│  └─ summarize.ts      matches -> comparison summary
└─ search/            # fan-out across retail sites`;

export default function ProjectStructure() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-4">
      <div className="text-center mb-10">
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
          Project structure
        </h2>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 items-stretch">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-2xl border border-[#16181F]/8 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 sm:p-7 flex flex-col justify-center gap-1"
        >
          {layers.map(({ icon: Icon, name, detail }, i) => (
            <motion.div key={name} variants={item} className="flex items-center gap-4 py-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#21365E]/8 dark:bg-blue-900/20 text-[#21365E] dark:text-blue-300 shrink-0">
                <Icon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#16181F] dark:text-white text-sm">{name}</p>
                <p className="text-xs text-[#5B6270] dark:text-white/60">{detail}</p>
              </div>
              {i < layers.length - 1 && (
                <FiArrowRight className="hidden sm:block text-[#5B6270]/30 shrink-0" />
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-[#16181F] dark:bg-[#1a1c28] p-6 sm:p-7 overflow-x-auto"
        >
          <pre
            className="text-[#F5F3EE] text-xs leading-relaxed whitespace-pre"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <code>{tree}</code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
}