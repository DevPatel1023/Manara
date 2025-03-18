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
    role: z.enum(['admin', 'client'])
});

// Login Schema Validation
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long!"),
    role: z.enum(['admin', 'client']),
    accessId : z.string()
});

// Signup Function
const Signup = async (req, res) => {
    try {
        const result = RegisterSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ msg: "Validation failed", errors: result.error.errors });
        }

        const { firstName, lastName, phoneNo, email, password, role } = result.data;

       
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
            role: role.toLowerCase() 
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

        const { email, password, role , accessId } = result.data;
        const user = await User.findOne({ email }).select("+password"); 

        if (!user) {
            return res.status(401).json({ msg: "Incorrect email ID", success: false });
        }

        if (user.role !== role.toLowerCase()) {
            return res.status(403).json({ msg: `Access denied for role: ${role}`, success: false });
        }

        const isPassMatched = await bcrypt.compare(password, user.password);
        if (!isPassMatched) {
            return res.status(401).json({ msg: "Incorrect password", success: false });
        }

        if (accessId !== process.env.ACCESS_ID) {
            return res.status(401).json({ msg: "Incorrect access id", success: false });
        }
        
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                role: user.role
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
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

module.exports = {
    Signup,
    Signin
};
