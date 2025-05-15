const express = require("express");
const { Signup, Signin , userInfo ,Updateuser,getAllUser } = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/Auth");
const upload = require('../middlewares/UploadImg'); 

const router = express.Router();

router.post("/signin",Signin);
router.post("/signup",Signup);
router.get("/user",authenticate,userInfo);
router.put("/updateuser",authenticate,upload.single('profileImage'),Updateuser);
router.get("/all",authenticate,getAllUser);

module.exports = router;
