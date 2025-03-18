//what it doers like i pass down to route that checks the user authorization and authentication
//authentication service : it's validation the user in system so it gets access
//authorization service : What access the person gets in the system throw it's role

const jwt = require("jsonwebtoken");

const authenticate = (req,res,next)=>{
    //gets the token and verifying the token is not expired

    const authheader = req.header("Authorization");
    //if token not present
    if(!authheader || !authheader.startsWith("Bearer")){
        return res.status(401).json({
            msg : "Access denied . No token provided",
            success : false
        })
    }

    const token = authheader?.split(" ")[1] || req.body.token || req.query.token;

    if (!token) {
        return res.status(401).json({
            msg: "Access denied. No token provided",
            success: false
        });
    }
    
    //if token is present
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                if(err.name === 'TokenExpiredError'){
                    return res.status(401).json({
                        msg : "token is expired , Please log in again.",
                        success : false
                    })
                }
                return res.status(403).json({
                    msg : "Invalid token",
                    success : false
                })
            }
            req.user = user;
            next();
        })
    }
   
}


//Gives access of resources on role based [Admin,client]
const authorization = (roles)=>{
   return(req,res,next)=>{
        
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({
                msg : `Access denied.Role  '${req.user?.role || 'Unknown'}' is not authorized.`,
                success : false
            });
        }
        next();
   }
}

module.exports = {
    authenticate,
    authorization
}