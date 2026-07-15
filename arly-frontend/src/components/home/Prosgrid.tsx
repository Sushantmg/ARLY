import { motion, type Variants } from 'framer-motion';
import { FiClock, FiEye, FiGlobe, FiLayers, FiMousePointer, FiMapPin } from 'react-icons/fi';

const pros = [
  { icon: FiClock, title: 'Minutes saved', detail: 'No more opening ten tabs by hand — one paste replaces the whole routine.' },
  { icon: FiEye, title: 'Real price transparency', detail: 'See what the same product actually costs across the market, side by side.' },
  { icon: FiGlobe, title: 'Wide local coverage', detail: 'Checks 10+ Nepali retail sites in one pass, not just one or two.' },
  { icon: FiLayers, title: 'Clean, structured data', detail: 'An LLM turns messy listings into one consistent, comparable format.' },
  { icon: FiMousePointer, title: 'One-paste simplicity', detail: 'No forms, filters, or manual search terms — just the link you already have.' },
  { icon: FiMapPin, title: 'Built for Nepal', detail: 'Tuned to how local retailers list, name, and price their products.' },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProsGrid() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-4">
      <div className="text-center mb-10">
        <span
          className="text-xs font-semibold tracking-widest uppercase text-[#D98E1B]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Why it's worth using
        </span>
        <h2
          className="text-3xl sm:text-4xl font-black text-[#16181F] dark:text-white mt-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Built to actually save you money
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {pros.map(({ icon: Icon, title, detail }) => (
          <motion.div
            key={title}
            variants={item}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-[#16181F]/8 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(22,24,31,0.25)]"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#D98E1B]/10 text-[#D98E1B] mb-4">
              <Icon className="text-lg" />
            </div>
            <h3 className="font-bold text-[#16181F] dark:text-white mb-1.5">{title}</h3>
            <p className="text-sm text-[#5B6270] dark:text-white/60 leading-relaxed">{detail}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}