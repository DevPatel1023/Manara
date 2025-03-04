const express = require("express");
const { Signup, Signin } = require("../controllers/user.controller");
const router = express.Router();

router.post("/signin",Signin);
router.post("/signup",Signup);

module.exports = router;
