import { motion, type Variants } from 'framer-motion';
import { FiLink2, FiCode, FiCpu, FiShare2, FiFileText } from 'react-icons/fi';

const steps = [
  {
    icon: FiLink2,
    title: 'Paste link',
    detail: 'You drop in a product URL from any Nepali retailer.',
  },
  {
    icon: FiCode,
    title: 'Scrape source',
    detail: 'ARLY fetches the page and pulls the raw product data.',
  },
  {
    icon: FiCpu,
    title: 'LLM normalize',
    detail: 'An LLM turns the mess into a clean name, price, and spec sheet.',
  },
  {
    icon: FiShare2,
    title: 'Fan-out search',
    detail: 'That clean name is queried across 10+ other local stores.',
  },
  {
    icon: FiFileText,
    title: 'LLM summary',
    detail: 'Results are ranked and summarized so you can decide at a glance.',
  },
];

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function PipelineFlow() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-4">
      <div className="text-center mb-14">
        <span
          className="text-xs font-semibold tracking-widest uppercase text-[#D98E1B]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          How it works
        </span>
        <h2
          className="text-3xl sm:text-4xl font-black text-[#16181F] mt-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Five steps, one link
        </h2>
      </div>

      <div className="relative">
        {/* connecting spine — animates in on scroll */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:block absolute top-6 left-6 right-6 h-px bg-[#D98E1B]/40 origin-left"
        />

        <div className="grid md:grid-cols-5 gap-8 md:gap-4">
          {steps.map(({ icon: Icon, title, detail }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={item}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="relative flex flex-col items-start md:items-center md:text-center"
            >
              <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#16181F] text-[#D98E1B] mb-4 shrink-0">
                <Icon className="text-lg" />
                <span
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#D98E1B] text-[#16181F] text-[10px] font-bold flex items-center justify-center"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-[#16181F] mb-1.5">{title}</h3>
              <p className="text-sm text-[#5B6270] leading-relaxed">{detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}