import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";

const create = asyncHandler(async (req, res) => {
    // console.log(req.body)

    // if(!req.user.isAdmin){
    //     throw new ApiError(400, "You are not allowed to create a post")
    // }
    
    // console.log("title", req.body.title)
    // console.log("content", req.body.content)

    if(!req.body.title || !req.body.content){
        throw new ApiError(400, "Please provide all required fields")
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-')
    console.log("slug", slug)

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id
    });

    // console.log("newpost is",newPost)

    // console.log("newpost", newPost)

    const savePost = await newPost.save({ validateBeforeSave: true });

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { post: savePost },
            "Post is created successfully"
        )
    )
});

const getPosts = asyncHandler(async (req, res) => {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId}),
        ...(req.query.category && { category: req.query.category}),
        ...(req.query.slug && { slug: req.query.slug}),
        ...(req.query.postId && { _id: req.query.postId}),
        ...(req.query.searchTerm && {
            $or: [
                { title: {$regex: req.query.searchTerm, $options: 'i'} },
                { content: {$regex: req.query.searchTerm, $options: 'i'}},
            ],
        }),
        }).sort({ updatedAt: sortDirection}).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: {$gte: oneMonthAgo},
        });
       
        return res.status(200)
        .json(
            new ApiResponse(200,
                {
                    posts,
                    totalPosts,
                    lastMonthPosts
                }   
            )
        );
});

const deletePost = asyncHandler(async (req, res) => {

    // if(!req.user.isAdmin){
    //     throw new ApiError(400, "You are not allowed to delete a post")
    // }

    const { postId } = req.params;
    // console.log("postId", postId);
  
    if (!isValidObjectId(postId)) {
      throw new ApiError(400, "Invalid postId");
    }
  
    await Post.findByIdAndDelete(postId);
  
    return res
      .status(200)
      .json(new ApiResponse(200, "Post deleted successfully"));

});

const updatePost = asyncHandler(async (req, res) => {
    // if(!req.user.isAdmin){
    //     throw new ApiError(400, "You are not allowed to delete a post")
    // }

    const { postId } = req.params;
    // console.log("postId", postId);
  
    if (!isValidObjectId(postId)) {
      throw new ApiError(400, "Invalid postId");
    }

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
            $set:{
                title: req.body.title,
                category: req.body.category,
                content: req.body.content,
                blogImage: req.body.blogImage
            }
        },
        {new: true}
    )

    // console.log("updated post is ", updatedPost)

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { post: updatedPost },
            "post is updated successfully"
        )
    )
});

export { create, getPosts, deletePost, updatePost};