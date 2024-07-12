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
        if (!localfilepath) return null;

        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        })
        // file has been uploaded to cloudinary
        console.log("the file uploaded successfully", response.url);
        return response;
        
    } catch (error) {
        // fs.unlinkSync(localfilepath)
        console.log("error in cloudinary", error); //removce the temporary file as the upload failed
        return null;
    }
}

export {uploadOnCloud}