import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import path from 'path';

const __dirname = path.resolve();

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())

//router
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js"

//routes declaration

app.use("/api/user", userRouter)
app.use("/api/auth", userRouter)
app.use("/api/post", postRouter)
app.use("/api/comment", commentRouter)

app.use(express.static(path.join(__dirname, '/frontend/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
})

export { app }