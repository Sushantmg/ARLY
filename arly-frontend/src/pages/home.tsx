import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import UrlInputHub from '../components/UrlInputHub';
import StatsStrip from '../components/home/Statsstrip';
import ProblemSolution from '../components/home/Problemsolution';
import PipelineFlow from '../components/home/Pipelineflow';
import ProjectStructure from '../components/home/Projectstructure';
import ProsGrid from '../components/home/Prosgrid';


interface HomeProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Home({ isLoading, setIsLoading }: HomeProps) {
  const navigate = useNavigate();

  const handleUrlSubmit = (url: string) => {
    setIsLoading(true);
    navigate(`/result?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] relative overflow-x-hidden">
      {/* single ambient marigold glow, hero only — the page's one decorative risk */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #D98E1B33 0%, transparent 70%)' }}
      />

      <motion.section
        className="relative flex flex-col items-center justify-center px-4 pt-20 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="w-full">
          <UrlInputHub onUrlSubmit={handleUrlSubmit} isLoading={isLoading} />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full mt-16">
          <StatsStrip />
        </motion.div>
      </motion.section>

      <div className="relative flex flex-col gap-24 pb-24">
        <ProblemSolution />
        <PipelineFlow />
        <ProjectStructure />
        <ProsGrid />
        <footer />
      </div>
    </div>
  );
}