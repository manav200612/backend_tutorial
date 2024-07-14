import { Router } from "express";
import {loginuser, logoutuser, refreshtaccesstoken, Registeruser} from "../controllers/user.controler.js";
import { upload } from "../middlewares/multer.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";

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

router.route("/login").post(loginuser)



//secured routes
router.route("/logout").post(verifyjwt, logoutuser)
router.route("/refreshtoken").post(refreshtaccesstoken)




// router.post("/register", async (req, res) => {
//     console.log("after");
//     console.log(req);
//     return res.json({"message": "Register"});
// })

export default router