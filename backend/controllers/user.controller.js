const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const { z } = require("zod");

// Register Schema Validation
const RegisterSchema = z.object({
    firstName: z.string().min(3, "First Name must be at least 3 characters long!"),
    lastName: z.string().min(3, "Last Name must be at least 3 characters long!"),
    phoneNo: z.string().length(10, "Phone number must be exactly 10 digits"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password should be at least 6 characters long!"),
});

// Login Schema Validation
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long!"),
});

// Signup Function
const Signup = async (req, res) => {
    try {
        const result = RegisterSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ msg: "Validation failed", errors: result.error.errors });
        }

        const { firstName, lastName, phoneNo, email, password, role } = req.body;  // ✅ Add 'role' here

        if (!role || !["admin", "employee", "client"].includes(role)) {
            return res.status(400).json({ msg: "Role is required and must be 'admin', 'employee', or 'client'." });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ msg: "Email already exists. Try a different email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = await User.create({
            firstName,
            lastName,
            phoneNo,
            email,
            password: hashedPassword,
            role // ✅ Include role when creating the user
        });

        return res.status(201).json({ msg: "User registered successfully!",newUser, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
//  Signin Function
const Signin = async (req, res) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ msg: "Validation failed", errors: result.error.errors });
        }

        const { email, password } = result.data;
        const user = await User.findOne({ email }).select("+password"); 

        if (!user) {
            return res.status(401).json({ msg: "Incorrect email ID", success: false });
        }

        const isPassMatched = await bcrypt.compare(password, user.password);
        if (!isPassMatched) {
            return res.status(401).json({ msg: "Incorrect password", success: false });
        }
        
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).json({
            msg: `Welcome, ${user.firstName}!`,
            success: true,
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
 
//get user info
const userInfo = async(req,res)=>{
    try {
        console.log(req.user);

        
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            res.status(404).json({
                msg : "user not found"
            })
        }
        console.log(user)
        res.status(200).json({
            user
        });
    } catch (error) {
        res.status(500).json({
           msg : "Intenal server error",
           error
        });
    }
}

//update user information
const Updateuser = async(req,res) => {
   try {
    const updates = req.body;
    console.log(updates)
    if(!updates){
        res.status(400).json({
            msg : "not provided data"
        })
    }
    const userId = req.user.id;
    if(!userId){
        res.status(401).json({
            msg : "Unauthorized user"
        })
     }
    const allowedUpdates = ['firstName','lastName','phoneNo','location','jobTitle','department','bio'];
    const updateFields = Object.keys(updates).filter(fileld => allowedUpdates.includes(fileld))

    if(updateFields.length === 0){
        return res.status(400).json({
            msg : "No Valid fileds to update"
        });
    }

    const updatedUser = await User.findByIdAndUpdate(userId,
        {$set : updates},
        {new : true,
        runValidators: true}
    ).select("-password");

    return res.status(200).json({
        msg : "Profile updated successfully",
        user : updatedUser
    })
   } catch (error) {
    console.log("Profile updated successfully",error);
    return res.status(500).json({
        msg : "Internal server Error"
    });
   }
}

const getAllUser = async () => {
    try {
        const users = User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({msg : "server error",error})
    }
}

module.exports = {
    Signup,
    Signin,
    userInfo,
    Updateuser,
    getAllUser
};