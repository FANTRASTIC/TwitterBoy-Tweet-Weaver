'use server';

import type { Article } from '@/lib/data';
import NewsAPI from 'newsapi';

// Simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchNews(
  topic: string,
  maxResults: number
): Promise<Article[]> {
  await sleep(1000); // Simulate API call latency

  if (!process.env.NEWS_API_KEY) {
    console.error('NewsAPI key is not configured.');
    return [];
  }

  // Initialize newsapi client inside the function
  // to ensure the API key is available.
  const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

  try {
    const response = await newsapi.v2.everything({
      q: topic,
      pageSize: maxResults,
      language: 'en',
      sortBy: 'relevancy',
    });

    if (response.status === 'ok') {
      const articles: Article[] = response.articles
        .map((article, index) => {
          if (!article.title || !article.description || !article.url) {
            return null;
          }
          return {
            id: `${topic}-${index}-${Date.now()}`,
            title: article.title,
            description: article.description,
            url: article.url,
            sourceName: article.source.name || 'Unknown Source',
            image: {
              id: `news-image-${index}`,
              imageUrl:
                article.urlToImage ||
                `https://picsum.photos/seed/${index + 1}/600/400`,
              description: article.title,
              imageHint: topic.split(' ')[0] || 'news',
            },
            topic: topic,
          };
        })
        .filter((article): article is Article => article !== null);
      return articles;
    } else {
      console.error('NewsAPI request failed:', response);
      return [];
    }
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error);
    return [];
  }
}
