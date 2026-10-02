import { sendToGroq } from "@/lib/groq";
import { groq } from "@/lib/groq";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Convert Web File to a format Groq SDK accepts (File object)
    // Next.js App Router exposes the File object natively from formData.get()
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3",
      response_format: "json",
      language: "en",
    });

    return Response.json({ text: transcription.text });
  } catch (error) {
    console.error("Speech API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
