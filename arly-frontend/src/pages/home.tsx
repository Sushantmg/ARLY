import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import UrlInputHub from '../components/UrlInputHub';

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
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="w-full max-w-2xl">
        <UrlInputHub onUrlSubmit={handleUrlSubmit} isLoading={isLoading} />
      </motion.div>
    </motion.div>
  );
}