import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

/*
------------------------------------
Generic AI Function
Accepts FULL prompt directly
------------------------------------
*/

const analyzeResumeWithAI = async (prompt) => {
  try {
    // Force strict JSON behavior
    const strictPrompt = `
IMPORTANT:

You must return ONLY valid JSON.

Rules:
- No explanation
- No markdown
- No code block
- No text before JSON
- No text after JSON
- No notes
- No headings

${prompt}
`;

    const result =
      await model.generateContent(
        strictPrompt
      );

    const response =
      await result.response;

    let text =
      response.text().trim();

    console.log("RAW GEMINI RESPONSE:");
    console.log(text);

    // remove markdown if Gemini adds it
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract ONLY JSON block safely
    const start =
      text.indexOf("{");

    const end =
      text.lastIndexOf("}");

    if (
      start === -1 ||
      end === -1
    ) {
      throw new Error(
        "No JSON found in Gemini response"
      );
    }

    const cleanedResponse =
      text.substring(
        start,
        end + 1
      );

    return cleanedResponse;

  } catch (error) {
    console.log(
      "Gemini Error:"
    );
    console.log(error);

    throw error;
  }
};

export {
  analyzeResumeWithAI,
};