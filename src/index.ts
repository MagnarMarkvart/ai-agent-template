// --- Agent Entry Point ---
//
// THE AGENTIC LOOP — how it works:
//
//  1. Load config and system prompt
//  2. Add the system prompt + user goal to memory
//  3. Call the AI model (provider.ask)
//  4. If the AI wants to use a tool → run it, add result to memory, go back to step 3
//  5. If the AI is done → print the result and stop
//  6. If max iterations hit → stop with a warning (prevents infinite loops)
//
// HOT SWAP PROVIDER: Change the import and constructor below to switch AI models.
//   import { ClaudeProvider } from './providers/claude.js';
//   const provider = new ClaudeProvider(process.env.ANTHROPIC_API_KEY!);

import 'dotenv/config';
import { GeminiProvider } from './providers/gemini.js';
import { agentConfig } from './config/agent.config.js';
import { defaultSystemPrompt } from './prompts/default.system.prompt.js';
import { AgentMemory } from './memory/context.js';
import { myToolSchemas } from './tools/schemas.js';
import { executeTool } from './tools/actions.js';
import { log, warn, error } from './utils/logger.js';
import { withRetry } from './utils/retry.js';

// --- Provider ---
// Change this line + the import above to swap to a different AI model.
const provider = new GeminiProvider(process.env.GEMINI_API_KEY!);

// --- Run ---
async function runAgent(goal: string): Promise<void> {
  const memory = new AgentMemory();

  memory.addMessage({ role: 'system', content: defaultSystemPrompt });
  memory.addMessage({ role: 'user', content: goal });

  log(`Starting agent. Goal: "${goal}"`);
  log(`Max iterations: ${agentConfig.maxIterations}`);

  for (let i = 0; i < agentConfig.maxIterations; i++) {
    log(`--- Iteration ${i + 1}/${agentConfig.maxIterations} ---`);
    memory.trimToFit(50);

    let response;
    try {
      response = await withRetry(
        () => provider.ask(memory.getMessages(), myToolSchemas),
        3,
        1000
      );
    } catch (err) {
      error('Provider call failed after retries. Stopping.', err);
      return;
    }

    if (response.toolCall) {
      log(`Tool call: ${response.toolCall.name}(${JSON.stringify(response.toolCall.args)})`);

      let result: unknown;
      try {
        result = await executeTool(response.toolCall.name, response.toolCall.args);
      } catch (err) {
        error(`Tool "${response.toolCall.name}" failed.`, err);
        memory.addMessage({ role: 'tool', content: `Error: ${String(err)}` });
        continue;
      }

      log(`Tool result: ${JSON.stringify(result)}`);
      memory.addMessage({
        role: 'assistant',
        content: `I used the tool "${response.toolCall.name}".`,
      });
      memory.addMessage({
        role: 'tool',
        content: JSON.stringify(result),
      });
    } else {
      log(`Agent finished.`);
      console.log('\n=== RESULT ===\n');
      console.log(response.text ?? '(no response)');
      console.log('\n==============\n');
      return;
    }
  }

  warn(`Max iterations (${agentConfig.maxIterations}) reached without a final answer.`);
}

// --- Change the goal here to run a different task ---
runAgent('Your goal here.').catch(err => {
  error('Unhandled error in runAgent', err);
  process.exit(1);
});
