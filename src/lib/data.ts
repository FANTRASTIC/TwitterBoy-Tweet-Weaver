import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export type Article = {
  id: string;
  title: string;
  description: string;
  url: string;
  sourceName: string;
  image: ImagePlaceholder;
  topic: string;
};

const allArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of AI: Trends to Watch in 2024',
    description: 'Generative AI, ethical frameworks, and AI-powered automation are set to dominate the tech landscape. Experts weigh in on what to expect from artificial intelligence this year.',
    url: 'https://example.com/news/ai-trends-2024',
    sourceName: 'Tech Today',
    image: PlaceHolderImages.find(img => img.id === 'news-2')!,
    topic: 'AI',
  },
  {
    id: '2',
    title: 'Breakthrough in Quantum Computing Could Change Everything',
    description: 'Researchers have announced a major leap in quantum processor stability, paving the way for computers that can solve currently unsolvable problems.',
    url: 'https://example.com/news/quantum-breakthrough',
    sourceName: 'Science Daily',
    image: PlaceHolderImages.find(img => img.id === 'news-1')!,
    topic: 'Technology',
  },
  {
    id: '3',
    title: 'New Ransomware Strain "CyberWeaver" Targets Global Corporations',
    description: 'A sophisticated new ransomware attack is actively targeting large enterprises, demanding multi-million dollar ransoms. Cybersecurity experts urge immediate patching of known vulnerabilities.',
    url: 'https://example.com/news/cyberweaver-ransomware',
    sourceName: 'Security Weekly',
    image: PlaceHolderImages.find(img => img.id === 'news-3')!,
    topic: 'Cybersecurity',
  },
  {
    id: '4',
    title: 'The Metaverse at Work: How VR is Shaping the Future of Collaboration',
    description: 'Companies are adopting virtual reality for remote team meetings, training simulations, and collaborative design, promising a new era of digital interaction.',
    url: 'https://example.com/news/metaverse-at-work',
    sourceName: 'Future Forward',
    image: PlaceHolderImages.find(img => img.id === 'news-4')!,
    topic: 'Technology',
  },
  {
    id: '5',
    title: 'Is Multi-Cloud the Right Strategy for Your Business?',
    description: 'While leveraging multiple cloud providers offers flexibility and avoids vendor lock-in, it also introduces complexity in management and security. Here\'s how to decide.',
    url: 'https://example.com/news/multicloud-strategy',
    sourceName: 'Cloud Insider',
    image: PlaceHolderImages.find(img => img.id === 'news-5')!,
    topic: 'Cloud Computing',
  },
  {
    id: '6',
    title: 'AI in Healthcare: Predicting Disease Before Symptoms Appear',
    description: 'New AI models can analyze medical records and genetic data to predict the likelihood of diseases like Alzheimers and cancer years in advance.',
    url: 'https://example.com/news/ai-healthcare-prediction',
    sourceName: 'Health Tech',
    image: PlaceHolderImages.find(img => img.id === 'news-6')!,
    topic: 'AI',
  }
];

export const getArticles = (topic?: string, maxResults: number = 5): Article[] => {
    if (!topic || topic.trim() === '') {
        return allArticles.slice(0, maxResults);
    }
    const searchTopics = topic.toLowerCase().split(/\s+/);
    const filtered = allArticles.filter(article => {
        const articleTopics = article.topic.toLowerCase().split(/\s+/);
        return searchTopics.some(st => articleTopics.includes(st));
    });
    return filtered.slice(0, maxResults);
}
