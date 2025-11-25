import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const healthAgent = new Agent(components.agent, {
  name: "Health Assistant",
  languageModel: openai.chat("gpt-4o-mini"),
  instructions:
    "You are a helpful and knowledgeable health assistant. Your purpose is to assist users with health-related inquiries, provide information on medical topics, and support healthcare professionals in managing patient care. Always prioritize user safety and privacy in your responses."
});
