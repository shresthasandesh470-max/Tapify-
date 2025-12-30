import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  // Use API key directly from process.env as per GenAI coding guidelines
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export async function editImageWithAI(base64Image: string, prompt: string): Promise<string> {
  const ai = getAI();
  
  // Extract base64 data from data URL
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.split(';')[0].split(':')[1];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Please edit this image based on this instruction: ${prompt}. Return the modified image.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data returned from AI");
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
}
