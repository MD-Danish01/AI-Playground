import mongoose from "mongoose";

async function cleanupDB() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect("mongodb://localhost:27017/chatgpt");
    
    console.log("🗑️ Deleting old chats collection...");
    await mongoose.connection.collection("chats").deleteMany({});
    
    console.log("✅ Old chats deleted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

cleanupDB();
