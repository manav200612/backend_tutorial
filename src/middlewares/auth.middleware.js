import jwt from "jsonwebtoken";
import { Apierror } from "../utils/apierror.js";
import { asynchandeler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";



export const verifyjwt = asynchandeler (async (req, res, next) => {
    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")

        console.log(token);
    
        if (!token) {
            throw new Apierror(401, "unauthorized request")
        }

    
        const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        const user = await User.findById(decodedtoken?._id).select("-password -refreshtoken")
    
        if (!user) {
            throw new Apierror(401, "unauthorized request")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new Apierror(401, error?.message || "invalid access token")
    }

})