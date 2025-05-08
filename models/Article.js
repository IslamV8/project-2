const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    createdAt: {
        type: Date,
        Default: Date.now,
    }
});

module.exports = mongoose.model("Article", articleSchema);