import { asynchandeler } from "../utils/asynchandler.js";

const Registeruser = asynchandeler( async (req, res) => {
    res.status(200).json({
        message: "ok",
    })
})

export default Registeruser;