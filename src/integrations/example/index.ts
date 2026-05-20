// --- Example Integration ---
// This file shows the exact pattern to follow when building a real integration.
// Copy this folder, rename it, and replace the stub logic with real API calls.
//
// Steps to turn this into a real integration:
//   1. Install the service's SDK:  npm install <package-name>
//   2. Add credentials to .env:   EXAMPLE_API_KEY=your_key_here
//   3. Replace the stub logic below with real API calls
//   4. Add the tool schema to src/tools/schemas.ts
//   5. Add the case to src/tools/actions.ts

// --- Fetch data from the external service ---
// Replace with a real API call, e.g.:
//   const client = new ExampleClient(process.env.EXAMPLE_API_KEY);
//   return await client.getData(query);
export async function exampleFetchData(query: string): Promise<{ result: string }> {
  console.log(`[example] Fetching data for query: "${query}"`);
  return { result: `Stub result for: ${query}` };
}

// --- Send data to the external service ---
// Replace with a real API call, e.g.:
//   return await client.postData(payload);
export async function exampleSendData(payload: Record<string, unknown>): Promise<{ success: boolean }> {
  console.log(`[example] Sending payload:`, payload);
  return { success: true };
}
