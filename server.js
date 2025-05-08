require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const articleRoutes = require("./routes/articleRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");

const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.json());


// Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 دقيقة
  max: 10, // بحد أقصى 10 requests في الدقيقة
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter);


// Logger to console فقط (لأن Vercel لا يسمح بكتابة ملفات)
app.use(morgan("dev"));


// =======================
// Routes
// =======================
app.use("/articles", articleRoutes);
app.use("/contact", contactRoutes);
app.use("/auth", authRoutes);


// =======================
// MongoDB Connection
// =======================
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ DB connection error:", err));


  app.get("/", (req, res) => {
    res.send("🚀 API is running!");
  });
  

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });


// =======================
// Server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});