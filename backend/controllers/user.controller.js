const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const { z } = require("zod");
const fs = require("fs")
const path = require("path")


// Register Schema Validation
const RegisterSchema = z.object({
    firstName: z.string().min(3, "First Name must be at least 3 characters long!"),
    lastName: z.string().min(3, "Last Name must be at least 3 characters long!"),
    phoneNo: z.string().length(10, "Phone number must be exactly 10 digits"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password should be at least 6 characters long!"),
    role: z.enum(['admin', 'employee', 'client']),
});

// Login Schema Validation
const loginSchema = z.object({
    email: z.string().email("Invalid email  address"),
    password: z.string().min(6, "Password must be at least 6 characters long!"),
    role: z.enum(['admin', 'employee', 'client']),
    accessId: z.string(),
});

// Signup Function
const Signup = async(req, res) => {
    try {
        const result = RegisterSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ msg: "Validation failed", errors: result.error.errors });
        }
        console.log("BACKEND - Received signup data:", result.data);
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
            role,
        });

        return res.status(201).json({ msg: "User registered successfully!", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

//  Signin Function
const Signin = async(req, res) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ msg: "Validation failed", errors: result.error.errors });
        }

        const { email, password, role, accessId } = result.data;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ msg: "Incorrect email ID", success: false });
        }

        const isPassMatched = await bcrypt.compare(password, user.password);
        if (!isPassMatched) {
            return res.status(401).json({ msg: "Incorrect password", success: false });
        }

        if ((role === "admin" || role === "employee") && accessId !== process.env.ACCESS_ID) {
            return res.status(401).json({ msg: "Incorrect Access Id", success: false })
        }
        console.log("BACKEND - Login attempt for:", result.data.email, "with role:", result.data.role);

        const token = jwt.sign({
                id: user._id,
                name: user.firstName,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET, { expiresIn: "24h" }
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

//get user info
const userInfo = async(req, res) => {
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


// Update user profile
const Updateuser = async (req, res) => {
    try {
      const updates = req.body
      console.log("Update request body:", updates)
  
      if (!updates) {
        return res.status(400).json({
          msg: "No data provided",
        })
      }
  
      const userId = req.user.id
      if (!userId) {
        return res.status(401).json({
          msg: "Unauthorized user",
        })
      }
  
      // Handle file upload if present
      if (req.file) {
        console.log("Processing uploaded file:", req.file.filename)
        const imagePath = path.join(__dirname, "../uploads/", req.file.filename)
  
        try {
          // Check if file exists before reading
          if (!fs.existsSync(imagePath)) {
            console.error(`File does not exist at path: ${imagePath}`)
            return res.status(500).json({
              msg: "Error: Uploaded file not found",
            })
          }
  
          // Read file from disk
          const imageData = fs.readFileSync(imagePath)
  
          // Add image data to updates object
          updates.image = {
            data: imageData,
            contentType: req.file.mimetype,
          }
  
          console.log("Image processed successfully")
  
          // Optionally clean up the file after storing in DB
          // fs.unlinkSync(imagePath);
        } catch (fileError) {
          console.error("Error processing image file:", fileError)
          return res.status(500).json({
            msg: "Error processing image file: " + fileError.message,
          })
        }
      }
  
      const allowedUpdates = ["firstName", "lastName", "phoneNo", "location", "JobTitle", "department", "bio", "image"]
      const updateFields = Object.keys(updates).filter((field) => allowedUpdates.includes(field))
  
      if (updateFields.length === 0) {
        return res.status(400).json({
          msg: "No valid fields to update",
        })
      }
  
      // Create an object with only the allowed fields
      const filteredUpdates = {}
      updateFields.forEach((field) => {
        filteredUpdates[field] = updates[field]
      })
  
      console.log("Updating user with fields:", updateFields)
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: filteredUpdates },
        {
          new: true,
          runValidators: true,
        },
      ).select("-password")
  
      if (!updatedUser) {
        return res.status(404).json({
          msg: "User not found",
        })
      }
  
      return res.status(200).json({
        msg: "Profile updated successfully",
        user: updatedUser,
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      return res.status(500).json({
        msg: "Internal Server Error: " + error.message,
      })
    }
  }
  

const getAllUser = async() => {
    try {
        const users = User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ msg: "server error", error })
    }
}

module.exports = {
    Signup,
    Signin,
    userInfo,
    Updateuser,
    getAllUser
};