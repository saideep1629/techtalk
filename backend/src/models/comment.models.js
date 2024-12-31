import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    numberOfLikes: {
        type: Number,
        default: 0
    },
},{timestamps:true}
)


export const Comment = mongoose.model('Comment',commentSchema)