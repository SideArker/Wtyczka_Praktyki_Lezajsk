interface ChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  system_fingerprint: null | string;
}

interface ChatChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  logprobs: null | any;
  finish_reason: string;
}
