import { ChatOpenAI } from "@langchain/openai";

// LLM instance
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

export default llm;
