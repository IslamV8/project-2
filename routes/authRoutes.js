const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");



const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}` });
});

  

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // 1. تحقق إذا كان اسم المستخدم موجود مسبقًا
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // 2. تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. حفظ المستخدم الجديد
        const newUser = new User({
            username,
            password: hashedPassword
        });
        
        await newUser.save();
        
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // 1. تأكد إن المستخدم موجود
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: "Invalid username or password" });
      }
  
      // 2. قارن الباسورد اللي المستخدم كتبه بالباسورد المشفر
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid username or password" });
      }

      // 3. أنشئ JWT token
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // التوكن صالح لمدة ساعة
      );
  
      // 4. رجّع التوكن للمستخدم
      res.json({ token });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
