// User.js
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const TagSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  usedIn: [
    { 
        blogId: {type: String, required: true }, 
        time: {type: Date, required: true }
    }
  ]
});

// Method to generate a hash from plain text
TagSchema.methods.usedByBlog = function (blogId) {
  this.usedIn.push({
      blogId: blogId, 
      time: Date.now()
  });
};

const Tag = mongoose.model('Tags', TagSchema);
module.exports = Tag;