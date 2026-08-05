// See https://platform.openai.com/docs/api-reference/chat/object
export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  conversation_id: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: [
    {
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
      index: number;
    }
  ];
}

// See https://platform.openai.com/docs/guides/error-codes/api-errors
export interface ErrorResponse {
  error: {
    message: string;
    type?: string;
    param?: string | null;
    code?: string | null;
  };
}
