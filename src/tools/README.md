# tools/

Two files. Always edit both together when adding a new capability.

| File | What it does |
|---|---|
| `schemas.ts` | Describes tools **to the AI** (JSON). The AI reads this and decides when to call a tool. |
| `actions.ts` | Runs the **actual code** when the AI calls a tool. |

## Adding a new tool (3 steps)

**1. Describe it in `schemas.ts`:**
```ts
{ name: 'send_email', description: 'Sends an email', parameters: { ... } }
```

**2. Implement the logic in `src/integrations/`:**
```
src/integrations/gmail/index.ts  →  export async function sendEmail(...)
```

**3. Wire it up in `actions.ts`:**
```ts
import { sendEmail } from '../integrations/gmail/index.js';
case 'send_email': return await sendEmail(args);
```
