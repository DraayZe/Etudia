import { GoogleGenerativeAI } from "@google/generative-ai";
import { FREE_PROMPT, PRO_PROMPT } from "./prompts.private";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const FREE_MODEL = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const PRO_MODEL = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // TODO: switch to gemini-2.5-pro when billing is enabled

export type Plan = "free" | "pro";

export function getAnalysisConfig(plan: Plan) {
  if (plan === "pro") {
    return { model: PRO_MODEL, prompt: PRO_PROMPT };
  }
  return { model: FREE_MODEL, prompt: FREE_PROMPT };
}
