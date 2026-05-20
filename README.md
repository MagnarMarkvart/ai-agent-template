# AI Agent Template

A provider-agnostic TypeScript template for building AI agents. Supports Gemini and Claude out of the box. Swap models, add integrations, and customize behavior without touching the core loop.

---

## Quickstart

```bash
git clone <repo-url> my-agent
cd my-agent
npm install
cp .env.example .env    # then fill in your API keys
npm start
```

Set your goal in `src/index.ts`:
```ts
runAgent('Research the top 3 competitors of Notion and write a comparison email.');
```

---

## Folder Structure

```
src/
├── index.ts              ← Entry point. Set your goal here. Hot-swap the provider here.
├── config/
│   └── agent.config.ts   ← Model, max iterations, temperature. Change behavior here.
├── prompts/
│   └── default.system.prompt.ts  ← The agent's instructions. Edit for each task type.
├── providers/
│   ├── gemini.ts         ← Google Gemini SDK adapter
│   └── claude.ts         ← Anthropic Claude SDK adapter
├── tools/
│   ├── schemas.ts        ← Describes tools to the AI (JSON)
│   └── actions.ts        ← Runs the actual code when a tool is called
├── integrations/
│   └── example/          ← Copy this pattern for Gmail, Slack, etc.
├── memory/
│   └── context.ts        ← Manages the conversation history array
└── utils/
    ├── logger.ts          ← Timestamped logging
    └── retry.ts           ← Exponential backoff for API calls
```

---

## How the Agent Loop Works

```
START
  │
  ▼
Add system prompt + user goal to memory
  │
  ▼
┌─────────────────────────────────────────┐
│            AGENT LOOP                   │
│                                         │
│  Ask AI model (provider.ask)            │
│         │                               │
│    ┌────▼─────────────────────────┐     │
│    │  AI wants to use a tool?     │     │
│    └────┬────────────┬────────────┘     │
│       YES            NO                 │
│         │             │                 │
│    Run tool      Print result           │
│    Add result    and STOP               │
│    to memory          │                 │
│         │           END                 │
│         └──────────► loop back          │
│                                         │
│  (stops at maxIterations if no answer)  │
└─────────────────────────────────────────┘
```

---

## How to: Swap the AI Model

1. Open `src/index.ts`
2. Change the import and constructor:
```ts
// FROM:
import { GeminiProvider } from './providers/gemini.js';
const provider = new GeminiProvider(process.env.GEMINI_API_KEY!);

// TO:
import { ClaudeProvider } from './providers/claude.js';
const provider = new ClaudeProvider(process.env.ANTHROPIC_API_KEY!);
```

---

## How to: Add a New Integration (e.g. Gmail)

1. **Create the integration folder and functions:**
```bash
mkdir src/integrations/gmail
touch src/integrations/gmail/index.ts
```
```ts
// src/integrations/gmail/index.ts
export async function sendEmail(to: string, subject: string, body: string) {
  // use googleapis here
}
```

2. **Describe the tool in `src/tools/schemas.ts`:**
```ts
{
  name: 'send_email',
  description: 'Sends an email to a recipient.',
  parameters: {
    type: 'object',
    properties: {
      to:      { type: 'string', description: 'Recipient email' },
      subject: { type: 'string', description: 'Subject line' },
      body:    { type: 'string', description: 'Email body' },
    },
    required: ['to', 'subject', 'body'],
  },
}
```

3. **Wire it up in `src/tools/actions.ts`:**
```ts
import { sendEmail } from '../integrations/gmail/index.js';
case 'send_email': return await sendEmail(args.to, args.subject, args.body);
```

4. **Update the system prompt** in `src/prompts/` to tell the agent it can send emails.

See `src/integrations/README.md` for the full list of planned integrations.

---

## How to: Change the Agent's Behavior

| I want to... | Edit this file |
|---|---|
| Change the AI model | `src/index.ts` (import + constructor) |
| Change max iterations / temperature | `src/config/agent.config.ts` |
| Change the agent's rules / personality | `src/prompts/default.system.prompt.ts` |
| Add a new capability / tool | `src/tools/schemas.ts` + `src/tools/actions.ts` |
| Add a new service | `src/integrations/<service>/index.ts` |
| Handle long conversations | `src/memory/context.ts` (`trimToFit`) |

---

## API Keys

Get your keys from:
- **Gemini**: [aistudio.google.com](https://aistudio.google.com)
- **Claude**: [console.anthropic.com](https://console.anthropic.com)
