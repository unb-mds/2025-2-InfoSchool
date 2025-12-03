// debug-env.js
console.log("=== DEBUG ENVIRONMENT ===");
console.log("GOOGLE_CLOUD_PROJECT:", process.env.GOOGLE_CLOUD_PROJECT);
console.log("GOOGLE_API_KEY exists:", !!process.env.GOOGLE_API_KEY);
const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
console.log("GOOGLE_APPLICATION_CREDENTIALS type:", typeof creds);
console.log("First 200 chars:", creds?.substring(0, 200));
console.log("StartsWith {?:", creds?.trim().startsWith("{"));
console.log('Contains "type"?:', creds?.includes("type"));
console.log("Contains service_account?:", creds?.includes("service_account"));
