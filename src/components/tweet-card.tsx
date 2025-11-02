'use client';

import {
  Copy,
  Info,
  Loader2,
  Share2,
  Twitter,
  Wand2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useState } from 'react';
import { rewriteTweet } from '@/ai/flows/rewrite-tweets-with-gen-ai';
import { useToast } from '@/hooks/use-toast';

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

interface TweetCardProps {
  tweet: Tweet;
  tone: Tone;
  onTweetUpdate: (tweet: Tweet) => void;
}

export function TweetCard({ tweet, tone, onTweetUpdate }: TweetCardProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  const { toast } = useToast();

  const handleRewrite = async () => {
    setIsRewriting(true);
    try {
      const result = await rewriteTweet({
        tweet: tweet.originalTweet,
        topic: tweet.topic,
        tone: tone,
      });

      onTweetUpdate({
        ...tweet,
        rewrittenTweet: result.rewrittenTweet,
        reasoning: result.reasoning,
      });

      toast({
        title: 'Tweet Rewritten!',
        description: 'AI has suggested an improved version.',
      });
    } catch (error) {
      console.error('Failed to rewrite tweet:', error);
      toast({
        variant: 'destructive',
        title: 'Error Rewriting Tweet',
        description: 'The AI model failed to rewrite the tweet. Please try again.',
      });
    } finally {
      setIsRewriting(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = tweet.rewrittenTweet || tweet.originalTweet;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Copied to clipboard!',
    });
  };
  
  const handleShare = () => {
    const textToShare = tweet.rewrittenTweet || tweet.originalTweet;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-lg">Tweet</CardTitle>
            <CardDescription>From: {tweet.articleTitle}</CardDescription>
          </div>
          <Badge variant="secondary">#{tweet.topic.replace(/\s+/g, '')}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm whitespace-pre-wrap">
          {tweet.rewrittenTweet || tweet.originalTweet}
        </p>
        {tweet.rewrittenTweet && (
          <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4" />
                  AI Rewrite Reasoning
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground italic">
                {tweet.reasoning}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2 justify-end">
        <Button variant="outline" onClick={handleRewrite} disabled={isRewriting}>
          {isRewriting ? <Loader2 className="animate-spin" /> : <Wand2 />}
          Rewrite
        </Button>
        <Button variant="outline" onClick={handleCopy}>
          <Copy />
          Copy
        </Button>
        <Button onClick={handleShare}>
            <Twitter />
            Share
        </Button>
      </CardFooter>
    </Card>
  );
}
