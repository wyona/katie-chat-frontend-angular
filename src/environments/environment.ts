// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
//
// INFO: Create API Key for Katie: http://localhost:8044/swagger-ui/index.html#/Authentication%20Controller%20v1/generateJWTForMyself

export const environment = {
 production: false,

 // Katie configuration (When SSE enabled, then make sure to login before asking a question)
 apiKey: null,
 baseUrlSSE: 'http://localhost:8044/api/v1',
 useSSE: false,
 loginUrl: './api/v1/auth/login?rememberMe=false&accessToken=true',
 logoutUrl: './api/v2/auth/logout',
 apiUrl: './api/v1/chat/completions/26cf31c2-8cb6-4e7e-9552-1c1f9f1ed035',
 model: 'UNSET',

 // LibreChat configuration
/*
 apiKey: null,
 model: 'UNSET',
 loginUrl: 'http://localhost:3080/api/auth/login',
 logoutUrl: 'http://localhost:3080/api/auth/logout',
 baseUrlSSE: 'http://localhost:3080/api/agents',
 apiUrl: 'http://localhost:3080/api/agents/chat/openAI',
 useSSE: true,
*/

 // OpenAI configuration
/*
 apiKey: 'YOUR_API_KEY_HERE',
 baseUrlSSE: 'https://api.openai.com/v1',
 useSSE: true,
 loginUrl: 'NONE',
 logoutUrl: 'NONE',
 apiUrl: 'https://api.openai.com/v1/chat/completions',
 model: 'gpt-4o',
*/

 temperature: 0.75,
};
