import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    role:{
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
})

export default mongoose.model.Message || mongoose.model("Message", MessageSchema);