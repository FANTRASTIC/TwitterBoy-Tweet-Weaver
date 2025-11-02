import { config } from 'dotenv';
config();

import '@/ai/flows/rewrite-tweets-with-gen-ai.ts';
import '@/ai/flows/summarize-articles-to-tweet-length.ts';