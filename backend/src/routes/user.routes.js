import { Router } from "express";
import { deleteUserAccount, getUserInCommentSection, getUsers, signin, signout, signup, updateUserDetails } from "../controllers/user.controllers.js"
import { google } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const userRouter = Router();

userRouter.post('/sign-up', signup)
userRouter.post('/sign-in', signin)
userRouter.post('/google', google)
userRouter.put('/update/:userId', updateUserDetails)
userRouter.delete('/delete/:userId', verifyJWT, deleteUserAccount)
userRouter.post('/sign-out', signout)
userRouter.get('/getUsers', verifyJWT, getUsers)
userRouter.get('/:userId', getUserInCommentSection)

export default userRouter;