# prompts/

System prompts live here. One file per agent type.

**The system prompt is the agent's brain.** It tells the AI who it is, what rules to follow, and how to behave — before the user even says anything.

| File | Purpose |
|---|---|
| `default.system.prompt.ts` | General-purpose starting point |

**When building a new agent, create a new file here:**

```
gmail.system.prompt.ts    → "You are an email assistant. Never send without confirmation..."
research.system.prompt.ts → "You are a research agent. Always cite sources..."
slack.system.prompt.ts    → "You are a Slack assistant. Keep replies under 3 sentences..."
```

Then import it in `src/index.ts` instead of the default.
