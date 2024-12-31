import dotenv from "dotenv";
import connectDB from "./db/db1.js"
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})

connectDB()
.then(() => {

    app.on("error",(err)=>{
        console.log("ERROR", err);
    })
    
     app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running on port ${process.env.PORT}`);
     })
})
.catch((error)=>{
    console.log("MONGODB connection failed", error);
})