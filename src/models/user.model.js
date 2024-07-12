import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userschema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    watchhistory: [
        {
            type: String,
            ref: 'Video',
        }
    ],
    password: {
        type: String,
        required: [true, "Please enter your password"],
    },
    refreshtoken: {
        type: String,
        default: null,
    }
}, {timestamps: true});


userschema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10 )
    next();
})

userschema.methods.ispasswordcorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userschema.methods.generateaccesstoken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userschema.methods.generaterefreshtoken = async function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}


export const User = mongoose.model('User', userschema);
