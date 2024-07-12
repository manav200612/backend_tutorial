import { asynchandeler } from "../utils/asynchandler.js";
import {Apierror} from "../utils/apierror.js";
import {User} from "../models/user.model.js";
import {uploadOnCloud} from "../utils/cloudnary.js"
import {Apiresponse} from "../utils/Apiresponse.js"


const Registeruser =  asynchandeler ( async (req, res) => {
    // get user details from frontend
    // validations
    // check if user alreday exists: username , email
    // check for images and avatar
    // upload them to cloudinary, avatar
    // create user onject - create entry in db
    // remove password and refresh token firld from res
    // chreck for user craetion 
    // return response

    const {fullname, email, username, password} = req.body
    console.log('"email"', email);

    if ([fullname, email, username, password].some((field)=>
        field?.trim() === "")
) {
        throw new Apierror(400, "all fields are required")
    }

    const existeduser = await User.findOne({
        $or: [{username},{email}]
    })

    if (existeduser) {
        throw new Apierror(409, "username or email already exists")        
    }

    const avatarlocalpath = req.files?.avatar[0]?.path;
    const coverphotolocalpath = req.files?.coverphoto[0]?.path;

    if (!avatarlocalpath) {
        throw new Apierror(400, "local avatar file is required")
    }

    const avatar = await uploadOnCloud(avatarlocalpath)
    const coverphoto = await uploadOnCloud(coverphotolocalpath)
    console.log(avatar, coverphoto, avatarlocalpath, coverphotolocalpath);

    if (!avatar) {
        throw new Apierror(400, "avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverphoto: coverphoto?.url || "",
        email,
        username: username.toLowerCase(),
        password,
    })

    const createduser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    if (!createduser) {
        throw new Apierror(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new Apiresponse(200, createduser, "user registered successfully")
    )

})

export default Registeruser;