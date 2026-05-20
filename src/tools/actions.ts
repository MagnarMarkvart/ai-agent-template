// --- Tool Actions ---
// When the AI decides to call a tool, the agent loop calls executeTool() with the
// tool name and arguments the AI chose. This function maps the name to real code.
//
// HOW TO ADD A NEW TOOL:
//   1. Add the tool schema to src/tools/schemas.ts (so the AI knows it exists).
//   2. Import the integration function here (from src/integrations/).
//   3. Add a case below that calls it and returns the result.
//
// EXAMPLE:
//   import { sendEmail } from '../integrations/gmail/index.js';
//   case 'send_email':
//     return await sendEmail(args.to, args.subject, args.body);
//
// The return value is serialized to JSON and fed back into the conversation
// so the AI can see what the tool returned and continue reasoning.

export async function executeTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    // Add cases here as you build integrations.
    // case 'send_email':
    //   return await sendEmail(args);

    default:
      throw new Error(`Unknown tool: "${name}". Add a case for it in src/tools/actions.ts.`);
  }
}
