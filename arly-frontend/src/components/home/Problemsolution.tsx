import { motion, type Variants } from 'framer-motion';
import { XCircle, CheckCircle } from 'lucide-react';

const problems = [
  'Opening 8–10 tabs (Daraz, SastoDeal, Hamrobazaar…) for one product',
  'Every site names, prices, and photographs the same item differently',
  'No single place shows what\u2019s actually cheapest right now',
];

const fixes = [
  'One link in, and ARLY reads the product for you',
  'An LLM normalizes the mess into one clean, comparable record',
  'That record is matched across 10+ local stores automatically',
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProblemSolution() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <span
          className="text-xs font-semibold tracking-widest uppercase text-[#D98E1B]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Why ARLY exists
        </span>
        <h2
          className="text-3xl sm:text-4xl font-black text-[#16181F] dark:text-white mt-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Comparing prices shouldn't be a part-time job
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="rounded-2xl bg-[#B23A48]/[0.04] dark:bg-red-900/10 border border-[#B23A48]/15 dark:border-red-400/20 p-7"
        >
          <h3 className="font-bold text-[#16181F] dark:text-white mb-4 text-lg">The tab-switching tax</h3>
          <ul className="space-y-3">
            {problems.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-[#5B6270] dark:text-white/60 leading-relaxed">
                <XCircle className="mt-0.5 shrink-0 text-[#B23A48] dark:text-red-400" size={18} />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-[#21365E]/[0.04] dark:bg-blue-900/10 border border-[#21365E]/15 dark:border-blue-400/20 p-7"
        >
          <h3 className="font-bold text-[#16181F] dark:text-white mb-4 text-lg">The ARLY fix</h3>
          <ul className="space-y-3">
            {fixes.map((f) => (
              <li key={f} className="flex gap-3 text-sm text-[#5B6270] dark:text-white/60 leading-relaxed">
                <CheckCircle className="mt-0.5 shrink-0 text-[#21365E] dark:text-blue-400" size={18} />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}       