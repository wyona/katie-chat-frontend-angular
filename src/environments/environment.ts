// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
//
// INFO: Create API Key for Katie: http://localhost:8044/swagger-ui/index.html#/Authentication%20Controller%20v1/generateJWTForMyself

export const environment = {
 production: false,

 // Katie configuration
 apiKey: null,
 baseUrl: 'http://localhost:8044/api/v1',
 apiUrlDISABLED_ALT_2: 'http://localhost:8044/api/v1/chat/completions/ROOT',
 apiUrlDISABLED_ALT_1: './api/v1/chat/completions/ROOT',
 useSSE: false,
 apiUrl: './api/v1/chat/completions/26cf31c2-8cb6-4e7e-9552-1c1f9f1ed035',
 useSSE_DISABLED: true,
 apiUrl_DISABLED: './api/v1/chat/completions',
 model: 'UNSET',

 // OpenAI configuration
 apiKey__DISABLED: 'YOUR_API_KEY_HERE',
 baseUrl__DISABLED: 'https://api.openai.com/v1',
 useSSE__DISABLED: false,
 apiUrl__DISABLED: 'https://api.openai.com/v1/chat/completions',
 model__DISABLED: 'gpt-4o',

 temperature: 0.75,
};
