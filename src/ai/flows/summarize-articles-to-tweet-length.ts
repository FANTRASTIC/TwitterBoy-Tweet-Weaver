'use server';

/**
 * @fileOverview Summarizes news articles into tweet-length snippets.
 *
 * - summarizeArticleToTweet - A function that summarizes a news article into a tweet.
 * - SummarizeArticleToTweetInput - The input type for the summarizeArticleToTweet function.
 * - SummarizeArticleToTweetOutput - The return type for the summarizeArticleToTweet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeArticleToTweetInputSchema = z.object({
  articleTitle: z.string().describe('The title of the news article.'),
  articleDescription: z.string().describe('The description of the news article.'),
  articleUrl: z.string().url().describe('The URL of the original news article.'),
  topic: z.string().describe('The topic of the news article.'),
});
export type SummarizeArticleToTweetInput = z.infer<typeof SummarizeArticleToTweetInputSchema>;

const SummarizeArticleToTweetOutputSchema = z.object({
  tweet: z.string().describe('The generated tweet.'),
});
export type SummarizeArticleToTweetOutput = z.infer<typeof SummarizeArticleToTweetOutputSchema>;

const MAX_TWEET_LENGTH = 280;

export async function summarizeArticleToTweet(input: SummarizeArticleToTweetInput): Promise<SummarizeArticleToTweetOutput> {
  return summarizeArticleToTweetFlow(input);
}

const summarizeArticleToTweetPrompt = ai.definePrompt({
  name: 'summarizeArticleToTweetPrompt',
  input: {schema: SummarizeArticleToTweetInputSchema},
  output: {schema: SummarizeArticleToTweetOutputSchema},
  prompt: `Summarize the following news article into a tweet (\u2264${MAX_TWEET_LENGTH} characters). Include a short summary, a hashtag based on the topic, and a link to the original source.\n\nTitle: {{{articleTitle}}}\nDescription: {{{articleDescription}}}\nURL: {{{articleUrl}}}\nTopic: {{{topic}}}\n\nTweet:`,
});

const summarizeArticleToTweetFlow = ai.defineFlow(
  {
    name: 'summarizeArticleToTweetFlow',
    inputSchema: SummarizeArticleToTweetInputSchema,
    outputSchema: SummarizeArticleToTweetOutputSchema,
  },
  async input => {
    let {output} = await summarizeArticleToTweetPrompt(input);

    // Enforce tweet length limit
    if (output!.tweet.length > MAX_TWEET_LENGTH) {
      output!.tweet = output!.tweet.substring(0, MAX_TWEET_LENGTH);
    }

    return output!;
  }
);
