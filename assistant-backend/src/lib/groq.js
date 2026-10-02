import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function sendToGroq(messages) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant", // Upgraded model to avoid overload timeouts
      response_format: { type: "json_object" },
    });
    
    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Error communicating with Groq:", error);
    throw error;
  }
}
