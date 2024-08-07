import { asynchandeler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloud } from "../utils/cloudnary.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { jwt } from "jsonwebtoken";




const generateaccessandrefreshtoken = async (userid) => {
    try {
        const user = await User.findById(userid)
        const accesstoken = await user.generateaccesstoken()
        const refreshtoken = await user.generaterefreshtoken()

        user.refreshtoken = refreshtoken
        await user.save({ validateBeforeSave: false })

        return { accesstoken, refreshtoken }

    } catch (error) {
        throw new Apierror(500, "something went wrong while generating access token or refresh token")
    }
}


const Registeruser = asynchandeler(async (req, res) => {
    // get user details from frontend
    // validations
    // check if user alreday exists: username , email
    // check for images and avatar
    // upload them to cloudinary, avatar
    // create user onject - create entry in db
    // remove password and refresh token firld from res
    // chreck for user craetion 
    // return response

    const { fullname, email, username, password } = req.body
    console.log('"email"', email);

    if ([fullname, email, username, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new Apierror(400, "all fields are required")
    }

    const existeduser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existeduser) {
        throw new Apierror(409, "username or email already exists")
    }

    const avatarlocalpath = req.files?.avatar[0]?.path;
    // const coverphotolocalpath = req.files?.coverphoto[0]?.path;

    let coverphotolocalpath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverphotolocalpath = req.files.coverimage[0];
    }

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


const loginuser = asynchandeler(async (req, res) => {
    // get user details from frontend
    // username / email
    //check if user exists
    // compare password
    // generate access and refresh token
    // send  in cookies
    // return response

    const { email, username, password } = req.body;
    console.log(req.body, email, username, password);

    if (!username && !email) {
        throw new Apierror(400, "username and email are required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new Apierror(400, "user doesnt exist")
    }

    const ispasswordvalid = await user.ispasswordcorrect(password)

    if (!ispasswordvalid) {
        throw new Apierror(401, "paasword is not a valid password")
    }

    const { accesstoken, refreshtoken } = await generateaccessandrefreshtoken(user._id)

    const loggedinuser = await User.findById(user._id).select("-password -refreshtoken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    // console.log(accesstoken, refreshtoken);

    return res.status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(
            new Apiresponse(
                200,
                {
                    user: loggedinuser, accesstoken, refreshtoken
                },
                "user logged in succesfully"
            )
        )

})

const logoutuser = asynchandeler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshtoken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accesstoken", options)
        .clearCookie("refreshtoken", options)
        .json(
            new Apiresponse(
                200,
                {},
                "user logged out succesfully"))
})

const refreshtaccesstoken = asynchandeler(async (req, res) => {
    const incomingrefreshtoken = req.cookies.refreshtoken || req.body.refreshtoken;

    if (!incomingrefreshtoken) {
        throw new Apierror(402, "unauthorized request");
    }

    try {
        const decodedtoken = jwt.verify(
            incomingrefreshtoken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedtoken?._id);

        if (!user) {
            throw new Apierror(402, "invalid refresh token");
        }

        if (incomingrefreshtoken !== user?.refreshtoken) {
            throw new Apierror(403, "refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accesstoken, newrefreshtoken } = await generateaccessandrefreshtoken(user._id);

        return res.status(200)
            .cookie("accesstoken", accesstoken, options)
            .cookie("refreshtoken", newrefreshtoken, options)
            .json(
                new Apiresponse(
                    200,
                    {
                        user: user.toObject({ getters: true }),
                        accesstoken,
                        newrefreshtoken
                    },
                    "access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new Apierror(401, error?.message || "unauthenticated");
    }
});


const changecurrentpassword = asynchandeler(async (req, res) => {
    const { oldpassword, newpassword } = req.body

    const user = await User.findById(req.user?._id)

    const ispasswordcorrect = user.ispasswordcorrect(oldpassword)

    if (!ispasswordcorrect) {
        throw new Apierror(400, "invalid password")
    }

    user.password = newpassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new Apiresponse(200, {}, "passwordchangessuccesfully"))

})

const getcurrentuser = asynchandeler(async (req, res) => {
    return res.status(200)
        .json(200, req.user, "current user fetched succesfully")
})



const updateaccountdetails = asynchandeler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname || !email) {
        throw new Apierror(400, "allfields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200)
        .json(new Apiresponse(200, user, "account details updated"))
})

const updateuseravatar = asynchandeler(async (req, res) => {
    const avatarlocalpath = req.file?.path

    if (!avatarlocalpath) {
        throw new Apierror(400, "avatar file is missing")
    }
    const avatar = await uploadOnCloud(avatarlocalpath)

    if (!avatar.url) {
        throw new Apierror(400, "error while uplaoding avatar file")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200)
       .json(new Apiresponse(200, user, "avatar image updated"))

})


const updateusercoverimage = asynchandeler(async (req, res) => {
    const coverlocalpath = req.file?.path

    if (!coverlocalpath) {
        throw new Apierror(400, "cover image file is missing")
    }
    const coverimage = await uploadOnCloud(coverlocalpath)

    if (!coverimage.url) {
        throw new Apierror(400, "error while uplaoding cover imnage file")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverimage: coverimage.url
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200)
       .json(new Apiresponse(200, user, "cover image updated"))
})

export {
    Registeruser,
    loginuser,
    logoutuser,
    refreshtaccesstoken,
    changecurrentpassword,
    getcurrentuser,
    updateaccountdetails,
    updateuseravatar,
    updateusercoverimage,
};
