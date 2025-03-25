const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {findUserByEmail}=require('../controller/function/queries')
const key = require("./secretkey");







// ✅ Middleware for verifying JWT token
const verify = async (req, res, next) => {
    console.log("Middleware executed"+req.originalUrl);
    //if(req.)
    if(req.originalUrl==='/auth/Signup' || req.originalUrl==='/auth/login'){console.log('logging');return next();}//calling next if its signup route
    if (!req.cookies?.auth_token) {
        try{
            console.log(req.cookies);
            return Login(req,res);
        }
        catch(err){console.log(err)}
    }
    
    try {
        const decoded = jwt.verify(req.cookies.auth_token, key);
        console.log(decoded);
        req.email = decoded.email; // Attach user info to `req`
        req.userid=decoded.userid
        req.status=decoded.status
        
        
        console.log('decode format for this is');
        console.log( decoded);
        console.log(req.originalUrl);
        if(req.originalUrl==='/verify' ){return res.status(200).json({user:"user verified"});}
        else{console.log('user verified');return next();}

    } catch (error) {
        console.log("Invalid Token:", error.message);
        return res.status(403).json({ msg: "Invalid or expired token" });
    }
};










const Login = async (req, res) => {
   console.log(req.body);
    try {
        if(!req.body.email){return res.status(403).json({msg:"user not logged in"});}
        const email=req.body.email;
        let result;
        try{
             result=await findUserByEmail({email});
        }
        catch(err){
            res.status(403).json({});
        }
       

        // Check password
        const isMatch = await bcrypt.compare(req.body.password, result.password);
        if (!isMatch) {
            return res.status(403).json({ msg: "Invalid password" });
        }
        console.log(result);
        req.userid=result.userid;
        
        // Generate JWT token 
        let status='user';
        if(email==='PBB@gmail.com')status='admin'
        const token = jwt.sign({ email:req.body.email,userid:result.user_id,status:'admin' }, key, { expiresIn: "2h" });

        // Send token as HttpOnly cookie
        console.log('user found');
        return res
            .status(200)
            .cookie("auth_token", token, { httpOnly: true, sameSite: "Lax" }) // ✅ Secure handling of cookies
            .cookie('status',status,{  sameSite: "Lax" })
            .json({ msg: "Login successful!" });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = { verify, Login };
