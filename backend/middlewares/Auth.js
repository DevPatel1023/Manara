const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // adjust path as needed


const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔁 Attach full user info (id, email, role) to req.user
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({ msg: "Invalid token", error });
    }
};


const authorization = (roles) => {
    return (req, res, next) => {
      console.log("Role from token:", req.user.role); // ✅ Debug log
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          msg: `Access denied. Role '${req.user.role}' not authorized.`,
          success: false,
        });
      }
  
      next();
    };
  };

  
  module.exports = { authenticate, authorization };
  

