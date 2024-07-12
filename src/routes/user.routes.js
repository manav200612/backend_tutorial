import { Router } from "express";
import Registeruser from "../controllers/user.controler.js";
import { upload } from "../middlewares/multer.js";

const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverphoto",
            maxCount: 1
        }
    ]),
    Registeruser)

// router.post("/register", async (req, res) => {
//     console.log("after");
//     console.log(req);
//     return res.json({"message": "Register"});
// })

export default router