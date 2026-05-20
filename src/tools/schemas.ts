import type { ToolSchema } from '../types/index.js';

// --- Tool Schemas ---
// This array is sent to the AI model on every call so it knows what tools it can use.
// A schema is NOT executable code — it's a JSON description of a function.
// The AI reads descriptions and decides which tool (if any) to call.
// The actual executable function lives in actions.ts.
//
// HOW TO ADD A NEW TOOL:
//   1. Add a new object to this array describing the tool.
//   2. Add the matching case in src/tools/actions.ts.
//   3. If the tool calls an external service, implement that in src/integrations/.
//
// EXAMPLE — what a real tool schema looks like:
//
// {
//   name: 'send_email',
//   description: 'Sends an email to a recipient. Use this when the user wants to send a message.',
//   parameters: {
//     type: 'object',
//     properties: {
//       to:      { type: 'string', description: 'Recipient email address' },
//       subject: { type: 'string', description: 'Email subject line' },
//       body:    { type: 'string', description: 'Email body text' },
//     },
//     required: ['to', 'subject', 'body'],
//   },
// },

export const myToolSchemas: ToolSchema[] = [
  // Add your tool schemas here.
  // Each entry here needs a matching case in src/tools/actions.ts.
];
