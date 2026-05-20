import type { Message } from '../types/index.js';

// --- Agent Memory ---
// The agent's memory is the array of messages sent to the AI on every call.
// The AI has no persistent state — it only "knows" what's in this array.
// Every tool call, result, user message, and AI reply gets added here.
//
// THE CONTEXT WINDOW PROBLEM:
// AI models can only read a limited number of tokens at once (the "context window").
// For reference: GPT-4o ≈ 128k tokens, Gemini 2.5 Flash ≈ 1M tokens, Claude 3.5 ≈ 200k tokens.
// For short-lived agents (< 20 messages), the flat array is fine.
// For long-running agents, you need a strategy to trim old messages.
//
// THREE STRATEGIES FOR LONG CONTEXTS (implement in trimToFit):
//   1. SLIDING WINDOW — delete the oldest non-system messages until you're under the limit.
//      Simple. Loses history.
//   2. SUMMARIZATION — call the AI to summarize old messages into one compact message.
//      More expensive but preserves meaning.
//   3. RAG (Retrieval-Augmented Generation) — store messages in a vector database and
//      retrieve only the most relevant ones per iteration.
//      Best for very long-running or multi-session agents.

export class AgentMemory {
  private messages: Message[] = [];

  addMessage(message: Message): void {
    this.messages.push(message);
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  getMessageCount(): number {
    return this.messages.length;
  }

  clear(): void {
    this.messages = [];
  }

  // Implement one of the strategies above when your agents start running long.
  trimToFit(maxMessages: number): void {
    if (this.messages.length > maxMessages) {
      console.warn(
        `[memory] Message count (${this.messages.length}) exceeds ${maxMessages}. ` +
        `Consider implementing a trim strategy in src/memory/context.ts.`
      );
    }
  }
}
