import UrlInputHub from '../components/UrlInputHub';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function Home({ isLoading, setIsLoading }: HomeProps) {
  const navigate = useNavigate();

  const handleUrlSubmit = (url: string) => {
    setIsLoading(true);
    // When a user submits a URL, we pass it as a query parameter to the /result page
    navigate(`/result?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="animate-fade-in">
      <UrlInputHub onUrlSubmit={handleUrlSubmit} isLoading={isLoading} />
    </div>
  );
}