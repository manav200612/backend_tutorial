import { v2 as cloudinary } from "cloudinary";

import fs from "fs";


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloud = async (localfilepath) => {
    try{
        console.log(localfilepath);
        // console.log(process.env.CLOUDINARY_CLOUD_NAME);
        // console.log(process.env.CLOUDINARY_API_KEY);
        // console.log(process.env.CLOUDINARY_API_SECRET);

        if (!localfilepath) return null;

        const response = await cloudinary.uploader.upload(localfilepath)

        // file has been uploaded to cloudinary
        //console.log("the file uploaded successfully", response.url);
        fs.unlinkSync(localfilepath)
        return response;
        
    } catch (error) {
        fs.unlinkSync(localfilepath) //removce the temporary file as the upload failed
        return null;
    }
}

export {uploadOnCloud}