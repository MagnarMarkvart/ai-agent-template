// --- Agent Configuration ---
// This is the single place where you control how the agent behaves.
// Never scatter these settings across provider files or index.ts.
//
// HOW TO USE:
// - Swap 'gemini' for 'claude' to change the AI model used (also update the import in index.ts)
// - Lower maxIterations if you want cheaper, faster runs during development
// - Raise maxTokens if the agent's replies are getting cut off
// - Lower temperature (0.0–0.3) for deterministic, factual agents
// - Raise temperature (0.7–1.0) for creative or conversational agents
//
// FOR MULTIPLE AGENT TYPES:
// Create additional config objects here and export them:
//   export const emailAgentConfig = { ...agentConfig, maxIterations: 5, temperature: 0.2 };
//   export const researchAgentConfig = { ...agentConfig, maxIterations: 20, maxTokens: 8192 };
// Then import the right one in index.ts.

export const agentConfig = {
  // Which AI provider to use. Must match the provider you instantiate in index.ts.
  provider: 'gemini' as 'gemini' | 'claude',

  // Hard cap on loop iterations. Prevents infinite loops.
  // The agent loop ends — even if not "done" — once this is reached.
  maxIterations: 10,

  // Maximum tokens the model can generate in a single response.
  // Higher = longer replies, higher API cost.
  maxTokens: 4096,

  // Controls randomness. 0 = fully deterministic. 1 = very creative.
  temperature: 0.7,
};
