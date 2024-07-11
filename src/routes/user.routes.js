import { Router } from "express";
import Registeruser from "../controllers/user.controler.js";

const router = Router()

router.route('/register').post(Registeruser)

export default Router