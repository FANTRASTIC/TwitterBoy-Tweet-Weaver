'use server';

import { getArticles, type Article } from '@/lib/data';

// Simulate network delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchNews(
  topic: string,
  maxResults: number
): Promise<Article[]> {
  await sleep(1000); // Simulate API call latency
  const articles = getArticles(topic, maxResults);
  return articles;
}
