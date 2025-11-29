import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize Gemini Client
// In a real app, ensure process.env.API_KEY is defined.
// For this demo, we assume the environment is set up correctly.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are ChefIApp's Intelligent Assistant, an expert in hospitality management, culinary arts, and workforce optimization.
Your role is to assist hotel and restaurant staff (from housekeeping to chefs and managers).

Capabilities:
1. Operations: Advise on shift scheduling, task prioritization, and safety protocols (HACCP).
2. Training: Provide quick tips for tasks (e.g., "How to set a VIP table", "Safe chemical handling").
3. Morale: Be encouraging, professional, and concise.

Context:
The user is using a mobile web app while working. Keep responses short (under 100 words unless asked for detail), actionable, and formatted nicely.
`;

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    if (!apiKey) {
      return "I'm in demo mode. To make me smart, please add a valid Gemini API Key to the environment.";
    }

    const modelId = "gemini-2.5-flash"; // Fast model for interactive chat
    
    // Construct the chat session
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result: GenerateContentResponse = await chat.sendMessage({
      message: message
    });

    return result.text || "I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the kitchen server right now. Please try again.";
  }
};
