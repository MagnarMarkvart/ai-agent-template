import Anthropic from '@anthropic-ai/sdk';
import type { AgentProvider, Message, AgentResponse, ToolSchema } from '../types/index.js';

// --- Claude Provider ---
// Wraps Anthropic's Claude SDK and adapts it to the AgentProvider interface.
// This file should ONLY contain Claude-specific SDK logic.
// All behavior settings (model name, max tokens) live in src/config/agent.config.ts.
//
// Claude-specific quirks handled here:
//   - System prompt: Claude takes it as a top-level 'system' parameter, not in the messages array
//   - Tool format: Claude expects { name, description, input_schema } shaped objects
//   - Response extraction: Claude returns tool calls as content blocks with type === 'tool_use'

export class ClaudeProvider implements AgentProvider {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  async ask(messages: Message[], tools: ToolSchema[]): Promise<AgentResponse> {
    const systemMessage = messages.find(msg => msg.role === 'system');
    const conversationMessages = messages.filter(msg => msg.role !== 'system');

    // Claude's tool schema format differs from our ToolSchema — remap it here.
    const claudeTools: Anthropic.Tool[] = tools.map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters as Anthropic.Tool['input_schema'],
    }));

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      ...(systemMessage ? { system: systemMessage.content } : {}),
      messages: conversationMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      ...(claudeTools.length > 0 ? { tools: claudeTools } : {}),
    });

    const toolBlock = response.content.find(block => block.type === 'tool_use');

    if (toolBlock && toolBlock.type === 'tool_use') {
      return {
        isDone: false,
        toolCall: {
          name: toolBlock.name,
          args: toolBlock.input as Record<string, unknown>,
        },
      };
    }

    const textBlock = response.content.find(block => block.type === 'text');
    return {
      isDone: true,
      text: textBlock?.type === 'text' ? textBlock.text : '',
    };
  }
}
