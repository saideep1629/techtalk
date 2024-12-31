import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.models.js";
import { Post } from "../models/post.models.js";

const createComment = asyncHandler(async (req, res) => {
  const { content, userId, postId } = req.body;

  if (userId != req.user.id) {
    throw new ApiError(400, "You are not allowed to create this comment");
  }

  const comment = await Comment.create({
    postId,
    userId,
    content,
  });

  const saveComment = await comment.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, saveComment, "Comment is created successfully"));
});

const getPostComments = asyncHandler(async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const comments = await Comment.find({ postId: req.params.postId })
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalComments = await Comment.countDocuments({
    postId: req.params.postId,
  });

  const now = new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthComments = await Comment.countDocuments(
    { postId: req.params.postId },
    {
      createdAt: { $gte: oneMonthAgo },
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        totalComments,
        lastMonthComments,
      },
      "Comments are fetched successfully"
    )
  );
});

const likeComments = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if(!comment){
    throw new ApiError(400, "Comment not found");
  }
  const userIndex = comment.likes.indexOf(req.user.id);
  if(userIndex === -1){
    comment.numberOfLikes += 1;
    comment.likes.push(req.user.id)
  }else{
    comment.numberOfLikes -= 1;
    comment.likes.splice(userIndex, 1);
  }

  await comment.save({validateBeforeSave: true});
  return res.status(200)
  .json(
    new ApiResponse(
      200,
      comment,
      "like functionality"
    )
  )
});

const editComments = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if(!comment){
    throw new ApiError(400, "Comment not found");
  }
  
  if(comment.userId !== req.user.id && !req.user.isAdmin){
    throw new ApiError(400, "You are not allowed to edit this comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      $set: {
        content: req.body.content,
      },
    },
    { new: true }
  )

  return res.status(200)
  .json(
    new ApiResponse(
      200,
      updatedComment,
      "update functionality"
    )
  )
});

const deleteComments = asyncHandler(async (req, res) => {
  // console.log("req",req.user.id)
  const comment = await Comment.findById(req.params.commentId);
  // console.log("comment",comment.userId)

  if(!comment){
    throw new ApiError(400, "Comment not found");
  }

  if (comment.userId !== req.user.id && !req.user.isAdmin)  {
    throw new ApiError(400, "You are not allowed to delete this comment");
  }

  await Comment.findByIdAndDelete(req.params.commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment is deleted successfully"));
});

const getcommentsAll = asyncHandler(async (req, res) => {
//   if(!req.user.isAdmin){
//     throw new ApiError(400, "You are not allowed to get comments")
// }
  const startIndex = parseInt(req.query.startIndex) || 0;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const limit = parseInt(req.query.limit) || 12;
  const comments = await Comment.find()
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalComments = await Comment.countDocuments();

  const now = new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthComments = await Comment.countDocuments(
    {
      createdAt: { $gte: oneMonthAgo },
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        totalComments,
        lastMonthComments,
      },
      "Comments are fetched successfully"
    )
  );
});

const getUserPostsComments = asyncHandler(async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  // Find all posts uploaded by the user
  // console.log("userid",req.params)
  const userPosts = await Post.find({ userId: req.params.userId }).select('_id');
  // console.log("userposts from comment controllers",userPosts)
  const postIds = userPosts.map(post => post._id); // Extract post IDs
  
  if (postIds.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found for this user"));
  }

  // Retrieve comments for all the user's posts
  const comments = await Comment.find({ postId: { $in: postIds } })
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  // Get total comments count for all user's posts
  const totalComments = await Comment.countDocuments({
    postId: { $in: postIds },
  });

  // Get the date one month ago
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  // Count the comments from the last month across all user's posts
  const lastMonthComments = await Comment.countDocuments({
    postId: { $in: postIds },
    createdAt: { $gte: oneMonthAgo },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        totalComments,
        lastMonthComments,
      },
      "Comments for all user posts are fetched successfully"
    )
  );
});



export { createComment, getPostComments, likeComments, editComments, deleteComments, getcommentsAll, getUserPostsComments};



