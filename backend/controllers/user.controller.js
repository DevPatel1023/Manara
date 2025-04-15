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
    role : z.enum(['admin','employee','client'])
});

// Login Schema Validation
const loginSchema = z.object({
    email: z.string().email("Invalid email  address"),
    password: z.string().min(6, "Password must be at least 6 characters long!"),
    role : z.enum(['admin','employee','client']),
    accessId : z.string(),
});

// Signup Function
const Signup = async (req, res) => {
    try {
        const result = RegisterSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ msg: "Validation failed", errors: result.error.errors });
        }
        console.log("BACKEND - Received signup data:", result.data);
        const { firstName, lastName, phoneNo, email, password,role } = result.data;

       
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ msg: "Email already exists. Try a different email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            firstName,
            lastName,
            phoneNo,
            email,
            password: hashedPassword,
            role
        });

        return res.status(201).json({ msg: "User registered successfully!", success: true  });
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

        const { email, password ,role, accessId} = result.data;
        const user = await User.findOne({ email }).select("+password"); 

        if (!user) {
            return res.status(401).json({ msg: "Incorrect email ID", success: false });
        }

        const isPassMatched = await bcrypt.compare(password, user.password);
        if (!isPassMatched) {
            return res.status(401).json({ msg: "Incorrect password", success: false });
        }

        if((role === "admin" || role === "employee") && accessId !== process.env.ACCESS_ID){
            return res.status(401).json({msg : "Incorrect Access Id",success : false})
        }
        console.log("BACKEND - Login attempt for:", result.data.email, "with role:", result.data.role);
        
        const token = jwt.sign(
            {
                id: user._id,
                name : user.firstName,
                email: user.email,
                role: user.role, 
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
                role : user.role
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
 
//get user info
const userInfo = async (req, res) => {
    try {
        console.log(req.user);
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: "user not found" }); // 🔁 add return here
        }

        console.log(user);
        return res.status(200).json({ user }); // ✅ safe response
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error", error });
    }
};

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