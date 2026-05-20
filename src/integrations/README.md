# integrations/

Each subfolder is a third-party service the agent can interact with.

An integration is just a set of async TypeScript functions. You write the functions, describe them in `src/tools/schemas.ts`, and wire them up in `src/tools/actions.ts`. The agent then gains the ability to call them autonomously.

---

## How to add a new integration (4 steps)

**1. Create a subfolder:**
```
src/integrations/gmail/index.ts
```

**2. Write the functions:**
```ts
export async function sendEmail(to: string, subject: string, body: string) { ... }
export async function readInbox(maxResults: number) { ... }
```

**3. Describe them in `src/tools/schemas.ts`** so the AI knows they exist.

**4. Wire them in `src/tools/actions.ts`** so the agent loop can run them.

---

## Planned Integrations

| Service | Package | Functions to build |
|---|---|---|
| **Gmail** | `googleapis` | `sendEmail`, `readInbox`, `searchEmails` |
| **Outlook** | `@microsoft/microsoft-graph-client` | `sendEmail`, `readInbox` |
| **Slack** | `@slack/web-api` | `sendMessage`, `readChannel`, `listChannels` |
| **WhatsApp** | `twilio` or WhatsApp Business API | `sendMessage` |
| **Notion** | `@notionhq/client` | `createPage`, `queryDatabase`, `appendBlock` |
| **Web scraping** | `playwright` | `scrapePage`, `takeScreenshot`, `clickElement` |
| **Web search** | `tavily` or `serper` | `search`, `searchNews` |
| **File system** | built-in `fs` | `readFile`, `writeFile`, `listDirectory` |

---

## Auth notes

Most services require OAuth or an API key. Store all credentials in `.env` and read them via `process.env`. Never hardcode keys in integration files.
