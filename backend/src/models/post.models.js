import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ["JavaScript", "python", "C Language", "React"]
    },
    blogImage: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXhuJQKMBBusPFT9V7Vk0jOZpLybtXujF54Q&s"
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true,
    }

} ,{timestamps: true})

export const Post = mongoose.model('Post', postSchema)