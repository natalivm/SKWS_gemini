
import { GoogleGenAI } from "@google/genai";
import { ModelData } from "../types";

export const generateThesis = async (data: ModelData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Act as a Senior Equity Research Analyst. Analyze the following DCF (Discounted Cash Flow) model data for Skyworks Solutions (SWKS).
    
    Current Metrics:
    - Current Price: $${data.price.toFixed(2)}
    - Implied Fair Value: $${data.implied.toFixed(2)}
    - Potential Upside/Downside: ${(data.upside * 100).toFixed(1)}%
    - WACC: ${(data.wacc * 100).toFixed(2)}%
    - 5-Year Rev CAGR: Bear: -0.5%, Base: 3%, Bull: 6% (approx based on scenario)
    
    Context:
    - Skyworks has 67% revenue concentration with Apple.
    - They are merging with Qorvo (QRVO).
    - Current Relative Strength (RS) is very low at 23.
    
    Task:
    Provide a concise (300 words max), professional "Investment Thesis".
    Focus on the risk/reward skew, the margin of safety, and the impact of the Qorvo merger.
    Format the response using clean Markdown with bold headings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "Unable to generate thesis at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to Gemini. Please check your API key and connection.";
  }
};
