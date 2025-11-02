'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { rewriteTweet } from '@/ai/flows/rewrite-tweets-with-gen-ai';
import { summarizeArticleToTweet } from '@/ai/flows/summarize-articles-to-tweet-length';
import { AppLogo } from '@/components/app-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Article } from '@/lib/data';
import {
  Copy,
  Download,
  Feather,
  FileText,
  Loader2,
  Newspaper,
  Wand2,
} from 'lucide-react';
import { useState } from 'react';
import { TweetCard } from '@/components/tweet-card';
import { Slider } from '@/components/ui/slider';
import SafeImage from '@/components/SafeImage';

type Tone = 'Neutral' | 'Breaking' | 'Casual';
type Tweet = {
  id: string;
  originalTweet: string;
  rewrittenTweet?: string;
  reasoning?: string;
  topic: string;
  sourceUrl: string;
  articleTitle: string;
};

// The raw article type from NewsAPI
type NewsAPIArticle = {
  title: string;
  url: string;
  description: string;
  source?: { name?: string };
  urlToImage?: string;
};

const DEFAULT_TWEET_LENGTH = 280;

export default function Home() {
  const [topic, setTopic] = useState<string>('AI');
  const [maxResults, setMaxResults] = useState<number>(3);
  const [tone, setTone] = useState<Tone>('Neutral');
  const [tweetLength, setTweetLength] = useState<number>(DEFAULT_TWEET_LENGTH);
  const [articles, setArticles] = useState<Article[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isFetchingNews, setIsFetchingNews] = useState<boolean>(false);
  const [generatingTweetId, setGeneratingTweetId] = useState<string | null>(
    null
  );
  const { toast } = useToast();

  const handleFetchNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetchingNews(true);
    setArticles([]);

    try {
      // Securely fetch news from our own API route
      const res = await fetch(
        `/api/news?topic=${encodeURIComponent(topic)}&max=${maxResults}`
      );

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to fetch news');
      }

      const { articles: rawArticles } = await res.json();

      if (!rawArticles || rawArticles.length === 0) {
        toast({
          title: 'No articles found',
          description: `Couldn't find any recent articles for the topic "${topic}".`,
        });
        setArticles([]);
        return;
      }
      
      const fetchedArticles: Article[] = rawArticles
        .map((article: NewsAPIArticle, index: number) => {
           if (!article.title || !article.description || !article.url) {
            return null;
          }
          return {
            id: `${topic}-${index}-${Date.now()}`,
            title: article.title,
            description: article.description,
            url: article.url,
            sourceName: article.source?.name || 'Unknown Source',
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
        .filter((article: Article | null): article is Article => article !== null);

      setArticles(fetchedArticles);

    } catch (error) {
      console.error('Failed to fetch news:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching news',
        description: (error as Error).message || 'Something went wrong. Please try again later.',
      });
    } finally {
      setIsFetchingNews(false);
    }
  };

  const handleGenerateTweet = async (article: Article) => {
    setGeneratingTweetId(article.id);
    try {
      const result = await summarizeArticleToTweet({
        articleTitle: article.title,
        articleDescription: article.description,
        articleUrl: article.url,
        topic: article.topic,
        maxLength: tweetLength,
      });
      const newTweet: Tweet = {
        id: `tweet-${Date.now()}`,
        originalTweet: result.tweet,
        topic: article.topic,
        sourceUrl: article.url,
        articleTitle: article.title,
      };
      setTweets(prev => [newTweet, ...prev]);
      toast({
        title: 'Tweet generated!',
        description: 'A new tweet has been added to your list.',
      });
    } catch (error) {
      console.error('Failed to generate tweet:', error);
      toast({
        variant: 'destructive',
        title: 'Error generating tweet',
        description: 'The AI model failed to generate a tweet. Please try again.',
      });
    } finally {
      setGeneratingTweetId(null);
    }
  };

  const handleDownloadTweets = () => {
    if (tweets.length === 0) {
      toast({
        title: 'No tweets to download',
        description: 'Generate some tweets first!',
      });
      return;
    }

    const fileContent = tweets
      .map((tweet, index) => {
        const content = tweet.rewrittenTweet || tweet.originalTweet;
        return `Tweet ${index + 1} (Topic: #${tweet.topic.replace(
          /\s+/g,
          ''
        )})\n---\n${content}\n\nSource: ${tweet.sourceUrl}\n\n\n`;
      })
      .join('');

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `tweets_${topic}_${timestamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download started',
      description: `tweets_${topic}_${timestamp}.txt`,
    });
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-card border-dashed border-2 h-full">
      <div className="p-4 bg-primary/10 rounded-full mb-4">
        <Feather className="w-12 h-12 text-primary" />
      </div>
      <h2 className="font-headline text-2xl font-bold mb-2">
        Welcome to Tweet Weaver
      </h2>
      <p className="text-muted-foreground max-w-md">
        Enter a topic in the sidebar to fetch the latest news articles, then let
        our AI craft engaging tweets for you.
      </p>
    </div>
  );

  return (
    <SidebarProvider>
      <Sidebar side="left" className="p-0 border-r" variant="sidebar">
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <AppLogo />
            <ThemeToggle />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <form onSubmit={handleFetchNews} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Artificial Intelligence"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-results">Max Articles</Label>
              <Select
                value={String(maxResults)}
                onValueChange={val => setMaxResults(Number(val))}
              >
                <SelectTrigger id="max-results">
                  <SelectValue placeholder="Select number of articles" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 10, 20].map(num => (
                    <SelectItem key={num} value={String(num)}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tweet Tone</Label>
              <Select
                value={tone}
                onValueChange={(val: Tone) => setTone(val)}
              >
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Breaking">Breaking News</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="tweet-length">Max Tweet Length</Label>
                <span className="text-sm text-muted-foreground">{tweetLength} chars</span>
              </div>
              <Slider
                id="tweet-length"
                min={50}
                max={280}
                step={10}
                value={[tweetLength]}
                onValueChange={vals => setTweetLength(vals[0])}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isFetchingNews}>
              {isFetchingNews ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Newspaper />
              )}
              Fetch News
            </Button>
          </form>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
          {/* Articles Column */}
          <div className="flex flex-col gap-4">
            <h2 className="font-headline text-2xl font-bold">News Feed</h2>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 -mr-2">
              {isFetchingNews &&
                [...Array(maxResults)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-40 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-36" />
                    </CardFooter>
                  </Card>
                ))}
              {!isFetchingNews && articles.length > 0
                ? articles.map(article => (
                    <Card key={article.id}>
                      <CardHeader>
                        <CardTitle className="font-headline">
                          {article.title}
                        </CardTitle>
                        <CardDescription>
                          Source: {article.sourceName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {article.image?.imageUrl ? (
                          <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-lg">
                            <SafeImage
                              src={article.image.imageUrl}
                              alt={article.image.description || article.title || 'Article image'}
                              fill
                              className="object-cover"
                              data-ai-hint={article.image.imageHint}
                            />
                          </div>
                        ) : null}
                        <p className="text-muted-foreground">
                          {article.description}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleGenerateTweet(article)}
                          disabled={generatingTweetId === article.id}
                        >
                          {generatingTweetId === article.id ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Wand2 />
                          )}
                          Generate Tweet
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                : !isFetchingNews && renderWelcome()}
            </div>
          </div>

          {/* Tweets Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-bold">
                Generated Tweets
              </h2>
              <Button
                variant="outline"
                onClick={handleDownloadTweets}
                disabled={tweets.length === 0}
              >
                <Download />
                Download All
              </Button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 -mr-2">
              {tweets.length > 0 ? (
                tweets.map((tweet, idx) => (
                  <TweetCard
                    key={tweet.id}
                    tweet={tweet}
                    tone={tone}
                    onTweetUpdate={updatedTweet =>
                      setTweets(currentTweets =>
                        currentTweets.map(t =>
                          t.id === updatedTweet.id ? updatedTweet : t
                        )
                      )
                    }
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-card border-dashed border-2 h-full">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <FileText className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="font-headline text-2xl font-bold mb-2">
                    No Tweets Yet
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Your generated and rewritten tweets will appear here. Fetch
                    some news to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
