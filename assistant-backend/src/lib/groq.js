import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function sendToGroq(messages) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama3-8b-8192", // Standard accessible Groq model
      response_format: { type: "json_object" },
    });

    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Error communicating with Groq:", error);
    throw error;
  }
}
