const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        // Ensure `req.headers` exists
        if (!req.headers) {
            return res.status(401).json({ msg: "No headers found", success: false });
        }

        const authHeader = req.headers["authorization"]; // Corrected header retrieval

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Access denied. No token provided", success: false });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ msg: "Invalid or expired token", success: false });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error", success: false });
    }
};

// Authorization Middleware
const authorization = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: `Access denied. Role '${req.user?.role || "Unknown"}' not authorized.`, success: false });
    }
    next();
};

module.exports = { authenticate, authorization };
