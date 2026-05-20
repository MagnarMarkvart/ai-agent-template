// --- Core message types ---
// Every conversation is a flat array of Message objects.
// The AI model reads this entire array on every call to understand context.
// 'system' = instructions (the agent's rules). 'user' = human input.
// 'assistant' = AI reply. 'tool' = the result of a tool the AI triggered.
export interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
}

// --- Tool types ---
// A ToolSchema is a JSON description of a function you want the AI to be able to call.
// The AI reads these schemas and decides when to use each tool.
// You never call the schema — it's documentation for the AI, not executable code.
// The actual executable code lives in src/tools/actions.ts.
export interface ToolSchema {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

// --- Response type ---
// Standardized response returned by every provider.
// If the AI wants to use a tool, toolCall is set and text is empty.
// If the AI is done thinking, text is set and toolCall is empty.
export interface AgentResponse {
  text?: string;
  toolCall?: ToolCall;
  isDone: boolean;
}

// --- Provider interface ---
// This is the key architectural contract. Every AI provider (Gemini, Claude, GPT-4, etc.)
// MUST implement this single method. This is what makes hot-swapping models possible:
// you change one line in index.ts and the rest of the code is untouched.
export interface AgentProvider {
  ask(messages: Message[], tools: ToolSchema[]): Promise<AgentResponse>;
}
