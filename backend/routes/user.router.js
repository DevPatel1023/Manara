const express = require("express");
const { Signup, Signin , userInfo ,userUpdate } = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/Auth");
const router = express.Router();

router.post("/signin",Signin);
router.post("/signup",Signup);
router.get("/user",authenticate,userInfo);
router.put("/Updateuser",authenticate,userUpdate);

module.exports = router;
