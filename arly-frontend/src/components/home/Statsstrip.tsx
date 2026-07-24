import { motion, type Variants } from 'framer-motion';
import { Link2, Globe, Cpu, Clock } from 'lucide-react';

const stats = [
  { icon: Link2, value: '1', label: 'Link is all you paste' },
  { icon: Globe, value: '10+', label: 'Nepali retailers cross-checked' },
  { icon: Cpu, value: '2', label: 'LLM passes — extract, then summarize' },
  { icon: Clock, value: '~20s', label: 'Typical time to full comparison' },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function StatsStrip() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-4"
    >
      {stats.map(({ icon: Icon, value, label }) => (
        <motion.div
          key={label}
          variants={item}
          className="rounded-2xl border border-[#16181F]/8 dark:border-white/10 bg-white/60 dark:bg-white/5 px-5 py-6 text-center"
        >
          <Icon className="mx-auto mb-3 text-xl text-[#D98E1B]" />
          <div
            className="text-3xl font-black text-[#16181F] dark:text-white mb-1"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {value}
          </div>
          <p className="text-xs text-[#5B6270] dark:text-white/60 font-medium leading-snug">{label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}