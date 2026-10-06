import { sendToGroq } from "@/lib/groq";
import { assistantSystemPrompt } from "@/lib/assistantPrompt";
import { validateAction } from "@/lib/validation";
import connectToDatabase from "@/lib/db";
import Memory from "@/models/Memory";

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.message || "";
    const conversationId = body.conversationId || "default";

    if (!userMessage) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Connect to DB and fetch Kairon's memories
    let memoryString = "";
    try {
      await connectToDatabase();
      const memories = await Memory.find().sort({ createdAt: -1 }).limit(10);
      memoryString = memories.map(m => `${m.key}: ${m.value}`).join('\n');
    } catch (dbError) {
      console.warn("Database connection failed, continuing without memories:", dbError.message);
    }
    
    // Inject memories into the system prompt dynamically
    const dynamicPrompt = `${assistantSystemPrompt}\n\nHere is what you know about the user and your environment from past memories:\n${memoryString || "No memories yet."}`;

    const messages = [
      { role: "system", content: dynamicPrompt },
      { role: "user", content: userMessage }
    ];

    const result = await sendToGroq(messages);

    // Validate the action returned by Groq
    if (result && result.action) {
      validateAction(result.action);
    }

    // Save the conversation to MongoDB so Kairon remembers
    try {
      if (result.response) {
        await Memory.create([
          { key: "User Message", value: userMessage },
          { key: "Kairon Response", value: result.response }
        ]);
      }
    } catch (saveError) {
      console.warn("Failed to save memory to MongoDB:", saveError.message);
    }

    return Response.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
