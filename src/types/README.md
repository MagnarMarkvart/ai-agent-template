# types/

Shared TypeScript interfaces used across the entire project.

| Type | Purpose |
|---|---|
| `Message` | A single turn in the conversation (user, assistant, system, tool) |
| `ToolSchema` | JSON description of a function — the AI reads this to know what tools exist |
| `ToolCall` | The tool name + arguments the AI chose to invoke |
| `AgentResponse` | Standardized return from any provider: either a tool call or a final text answer |
| `AgentProvider` | The interface every AI provider must implement (`ask`) |

**Rule:** Only add types here that are used in more than one file. If a type is local to one file, define it there.
