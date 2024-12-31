import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";


export const verifyJWT = asyncHandler( async(req, _, next) => {
        try {
            // console.log("req", req)
            // console.log("req header", req.header)
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace(/^Bearer\s+/, "");
            console.log("token", token)
    
            if(!token){
                throw new ApiError(401, "Unauthorized request")
            }
    
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
            if(!user){
                throw new ApiError(401, "Invalid access token")
            }
    
            req.user = user
            next()
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid access token")
        }

})