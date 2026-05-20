# providers/

One file per AI model. Each provider adapts its SDK to the shared `AgentProvider` interface.

| File | Model |
|---|---|
| `gemini.ts` | Google Gemini 2.5 Flash |
| `claude.ts` | Anthropic Claude 3.5 Sonnet |

## How to add a new provider (e.g. OpenAI GPT-4o)

**1. Install the SDK:**
```bash
npm install openai
```

**2. Create `src/providers/openai.ts`:**
```ts
import OpenAI from 'openai';
import type { AgentProvider, Message, AgentResponse, ToolSchema } from '../types/index.js';

export class OpenAIProvider implements AgentProvider {
  private client: OpenAI;
  constructor(apiKey: string) { this.client = new OpenAI({ apiKey }); }

  async ask(messages: Message[], tools: ToolSchema[]): Promise<AgentResponse> {
    // Adapt OpenAI's SDK to return AgentResponse
  }
}
```

**3. Import it in `src/index.ts`** and swap it in for the current provider.

## Why this pattern?

Each SDK works differently. Gemini calls tools via `functionCalls`. Claude uses content blocks. OpenAI uses `tool_calls`. The provider file is where you handle those differences so the rest of the codebase stays clean and never changes when you switch models.
