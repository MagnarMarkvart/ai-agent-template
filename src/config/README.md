# config/

All agent behavior settings live here.

**`agent.config.ts`** — controls provider, max iterations, token limits, and temperature.

Change settings here. Never hardcode them in `index.ts` or provider files.

To create a variant for a specific agent type (e.g. a focused email agent), add a new exported config object in the same file:

```ts
export const emailAgentConfig = { ...agentConfig, maxIterations: 5, temperature: 0.2 };
```
