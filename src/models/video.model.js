import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoschema = new Schema({

    videofile: {
        type: String,
        required: true
    }, 
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        defaultValue: 0,
        required: true
    },
    ispublished:{
        type: Boolean,
        default: true,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }


}, {timestamps: true})

videoschema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema)