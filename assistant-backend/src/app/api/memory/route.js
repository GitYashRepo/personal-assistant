import connectToDatabase from '@/lib/db';
import Memory from '@/models/Memory';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { key, value } = await req.json();

    if (!key || !value) {
      return Response.json({ error: "Both key and value are required" }, { status: 400 });
    }

    // Upsert the memory item
    const memory = await Memory.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );

    return Response.json({ success: true, memory });
  } catch (error) {
    console.error("Memory POST Error:", error);
    return Response.json({ error: "Failed to save memory" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    
    // Extract query param ?key=something
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key) {
      const memory = await Memory.findOne({ key });
      return Response.json({ success: true, data: memory ? memory.value : null });
    }

    // Return all memories if no key provided
    const allMemories = await Memory.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: allMemories });
  } catch (error) {
    console.error("Memory GET Error:", error);
    return Response.json({ error: "Failed to fetch memories" }, { status: 500 });
  }
}
