import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createComment, deleteComments, editComments, getcommentsAll, getPostComments, getUserPostsComments, likeComments } from "../controllers/comment.controllers.js"



const commentRouter = Router();

commentRouter.post('/create', verifyJWT, createComment)
commentRouter.get('/get-comments/:postId', getPostComments)
commentRouter.put('/like-comments/:commentId', verifyJWT, likeComments)
commentRouter.put('/edit-comment/:commentId', verifyJWT, editComments)
commentRouter.delete('/delete-comment/:commentId', verifyJWT, deleteComments)
// commentRouter.get('/getcommentsAll', verifyJWT, getPostCommentsAll)
commentRouter.get('/getcommentsAll', verifyJWT, getcommentsAll)
commentRouter.get('/getUserPostsComments/:userId', verifyJWT, getUserPostsComments)

export default commentRouter;