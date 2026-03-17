import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8');
const match = env.match(/OPENAI_API_KEY=(.*)/);
const key = match ? match[1].trim() : '';

const openai = createOpenAI({
  apiKey: key,
});

const schema = z.object({
  plantName: z.string(),
});

async function test() {
  try {
    console.log('[TEST] Init...');
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: schema,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'what is this' }
          ]
        }
      ]
    });
    console.log('[TEST] Success:', object);
  } catch (err) {
    console.error('[TEST] Failed with error:', err.message);
    if (err.cause) {
      console.error('[TEST] Cause:', err.cause);
    }
  }
}

test();
