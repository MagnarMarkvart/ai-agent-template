// --- System Prompt ---
// The system prompt is the most important part of any agent.
// It is injected as the FIRST message in every conversation, before the user's goal.
// Think of it as the agent's job description, rulebook, and personality — all in one string.
//
// WHAT TO PUT HERE:
//   - The agent's role: "You are a research assistant that..."
//   - How it should think: "Think step by step before acting"
//   - Rules and constraints: "Never send an email without confirming with the user first"
//   - Tool-use guidance: "Always use the search tool before answering factual questions"
//   - Output format: "Always end your final response with a summary bullet list"
//
// FOR DIFFERENT AGENT TYPES:
//   Create a new file per agent and import the right one in index.ts:
//     src/prompts/gmail.system.prompt.ts    → for a Gmail automation agent
//     src/prompts/research.system.prompt.ts → for a web research agent
//     src/prompts/slack.system.prompt.ts    → for a Slack bot agent
//
// TIP: Short, specific prompts work better than long vague ones.
// The model reads this on every iteration, so every word costs tokens.

export const defaultSystemPrompt = `
You are a capable, general-purpose AI agent.

Your job is to complete the user's goal as accurately and efficiently as possible.

Rules:
- Think step by step before taking any action.
- If a tool is available and relevant, use it. Do not answer from memory when fresh data would be better.
- Never fabricate facts, URLs, names, or data. If you do not know something, say so.
- When you have fully completed the goal, give a clear final answer and stop. Do not keep looping.
- Be concise. Avoid filler phrases like "Certainly!" or "Of course!".
`.trim();
