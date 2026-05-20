import { GoogleGenAI } from '@google/genai';
import type { AgentProvider, Message, AgentResponse, ToolSchema } from '../types/index.js';

// --- Gemini Provider ---
// Wraps Google's Gemini SDK and adapts it to the AgentProvider interface.
// This file should ONLY contain Gemini-specific SDK logic.
// All behavior settings (model name, max tokens) live in src/config/agent.config.ts.
//
// Gemini-specific quirks handled here:
//   - Role mapping: our 'assistant' → Gemini's 'model'
//   - Tool format: Gemini expects functionDeclarations inside a tools array
//   - Response extraction: Gemini returns function calls on response.functionCalls

export class GeminiProvider implements AgentProvider {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async ask(messages: Message[], tools: ToolSchema[]): Promise<AgentResponse> {
    const formattedMessages = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    const systemMessage = messages.find(msg => msg.role === 'system');

    const config = {
      ...(systemMessage ? { systemInstruction: systemMessage.content } : {}),
      ...(tools.length > 0 ? { tools: [{ functionDeclarations: tools }] } : {}),
    };

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedMessages,
      config,
    });

    const call = response.functionCalls?.[0];

    if (call) {
      return {
        isDone: false,
        toolCall: {
          name: call.name ?? '',
          args: (call.args ?? {}) as Record<string, unknown>,
        },
      };
    }

    return {
      isDone: true,
      text: response.text ?? '',
    };
  }
}
