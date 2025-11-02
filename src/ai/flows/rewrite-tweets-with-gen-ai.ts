'use server';
/**
 * @fileOverview Rewrites a generated tweet to sound more human and engaging using generative AI.
 *
 * - rewriteTweet - A function that rewrites a generated tweet.
 * - RewriteTweetInput - The input type for the rewriteTweet function.
 * - RewriteTweetOutput - The return type for the rewriteTweet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteTweetInputSchema = z.object({
  tweet: z.string().describe('The tweet to rewrite.'),
  topic: z.string().describe('The topic of the tweet.'),
  tone: z.enum(['Neutral', 'Breaking', 'Casual']).optional().describe('The tone of the tweet.'),
});
export type RewriteTweetInput = z.infer<typeof RewriteTweetInputSchema>;

const RewriteTweetOutputSchema = z.object({
  rewrittenTweet: z.string().describe('The rewritten tweet.'),
  reasoning: z.string().describe('The reasoning behind the rewrite or lack thereof.'),
});
export type RewriteTweetOutput = z.infer<typeof RewriteTweetOutputSchema>;

export async function rewriteTweet(input: RewriteTweetInput): Promise<RewriteTweetOutput> {
  return rewriteTweetFlow(input);
}

const rewriteTweetPrompt = ai.definePrompt({
  name: 'rewriteTweetPrompt',
  input: {schema: RewriteTweetInputSchema},
  output: {schema: RewriteTweetOutputSchema},
  prompt: `You are an AI assistant specializing in improving tweets to make them more human and engaging.  The topic is {{{topic}}}. The original tweet is: {{{tweet}}}.

Your goal is to rewrite the tweet to make it more appealing while keeping the information accurate and concise.

Consider the following aspects:
- **Engaging Language:** Use more relatable and interesting language.
- **Human Tone:** Avoid sounding robotic or automated.
- **Conciseness:** Keep the tweet within the character limit (280 characters).
- **Topic Hashtag**: Include a relevant hashtag based on the topic.

If the tweet is already well-written and engaging, you may choose to leave it as is. In this case, explain why the original tweet is good and doesn't need changes.

Output the rewritten tweet and your reasoning in the following format:
{
  "rewrittenTweet": "The rewritten tweet or the original tweet if no changes were made",
  "reasoning": "Explanation of why the tweet was rewritten or why it was left unchanged"
}

Respond with ONLY valid JSON. Do not include any other text.`,
});

const rewriteTweetFlow = ai.defineFlow(
  {
    name: 'rewriteTweetFlow',
    inputSchema: RewriteTweetInputSchema,
    outputSchema: RewriteTweetOutputSchema,
  },
  async input => {
    const {output} = await rewriteTweetPrompt(input);
    return output!;
  }
);
