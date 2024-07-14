import mongoose , {Schema} from "mongoose";

const subscriptionschema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: 'User'
    },
    channel:{
        type: Schema.Types.ObjectId, // to whom subsciber is subsccribing
        ref: 'User'
    },
}, {timestamps: true})


export const Subscription = mongoose.model("Subscription", subscriptionschema)