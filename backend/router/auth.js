const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const key = require('./secretkey'); // Store your secret key securely
const bcrypt = require("bcrypt"); // For password hashing
const cookieParser = require("cookie-parser"); 
const { createUser } = require('../controller/function/queries');
const { verify, Login } = require('./Login&verify'); // Import verification middleware and Login function
const { createConnection } = require('../controller/function/connect_server');

router.use(cookieParser()); // Middleware to parse cookies

// Signup Route
router.post('/Signup', async (req, res) => {

  
    
    console.log('entered');
    if (req.cookies.auth_token) { 
        try {
            const decoded = jwt.verify(req.cookies.auth_token, key);
            console.log("Verified user");
            return res.status(200).json({ verified: true });
        } catch (error) {
            console.log("Invalid Token:", error.message);
            return res.status(403).json({ msg: "Invalid or expired token" });
        }
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        
        let result;
        try {
            
            result = await createUser({email:req.body.email, password:hashedPassword,username:req.body.username});
            if (!result) {
                console.log('User registered');
                return res.status(201).json({ msg: "User registered successfully!" });
            }
            else{
                console.log('here is the result ',result);
            }
        } catch (err) {
            console.error("Database error:", err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }

        // Generate JWT Token
        console.log(result);
        const token = jwt.sign({ email: req.body.email,userid: result.user_id,status:'customer'}, key, { expiresIn: "2h" });

        return res
            .status(201) // 201 for created
            .cookie("auth_token", token, { httpOnly: true })
            .json({ msg: "User registered successfully!" });

    } catch (error) {
        console.log("Signup error:", error);
        return res.status(409).json({ msg: "Duplicate data" }); // 409 for duplicate user
    }
});

// Protected Route Example
router.get('/', verify, (req, res) => {
    res.json({ msg: "Protected route accessed", user: req.user });
});

// Login Route
router.post('/login', Login);

// Logout Route
router.post('/Logout', (req, res) => {
    return res
        .clearCookie("auth_token")
        .json({ msg: "Logged out successfully" });
});

module.exports = router;
