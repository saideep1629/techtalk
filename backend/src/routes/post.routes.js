import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { create, deletePost, getPosts, updatePost } from "../controllers/post.controllers.js";


const postRouter = Router();

postRouter.post('/create', verifyJWT, create)
postRouter.get('/getPosts', getPosts)
postRouter.post('/deletePost/:postId/:userId', verifyJWT, deletePost)
postRouter.put(`/update-post/:postId/:userId`, verifyJWT, updatePost)

export default postRouter;