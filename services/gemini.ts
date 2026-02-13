
import { GoogleGenAI, Type } from "@google/genai";

export const generateLoveMessage = async (partnerName: string, myName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a very short, sweet, and cute Valentine's day message from ${myName} to ${partnerName}. 
      Use romantic emojis like ❤️, ✨, and 🌹. Keep it under 50 words. Focus on being cheesy but adorable.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text || "You are the most beautiful person in the world. I love you more than words can say. ❤️";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Happy Valentine's Day, ${partnerName}! Every moment with you is a gift. I'm so lucky to have you. Love, ${myName} ❤️`;
  }
};
