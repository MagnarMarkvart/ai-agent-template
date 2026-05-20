# memory/

Manages the agent's conversation history.

**`context.ts`** — `AgentMemory` class that wraps the messages array.

The AI has no built-in memory between calls. Every message (user input, AI replies, tool calls, tool results) is stored here and sent to the model on every iteration.

## When to worry about this

For short agents (< 20 messages), the flat array works fine.

For long-running agents, implement a strategy in the `trimToFit` method:

| Strategy | When to use | How |
|---|---|---|
| Sliding window | Simple agents, some history loss is OK | Delete oldest messages when over limit |
| Summarization | Medium complexity, need to preserve context | Call the AI to compress old messages |
| RAG | Long-running or multi-session agents | Store in a vector DB, retrieve relevant messages |
