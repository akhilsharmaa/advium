// User.js
const mongoose = require('mongoose');

const BlogBodySchema = new mongoose.Schema({
    
    post_id: { 
        type: String, 
        required: true 
    }, 
    author_id: { 
        type: String, 
        required: true 
    }, 
    title: { 
            type: String, 
            required: true
    },
    markdown_body: { 
        type: String, 
        required: true 
    },
    time: { 
        type: Date, 
        default: Date.now()
    }, 
    tags : [
        { type: String, required: false }
    ], 
    thumbnailBase64: {
        type: String, // Store the image in base64 format
        required: false 
    }, 
    status: []
});

BlogBodySchema.methods.addNewStatus = function (name) {
    this.status.push({
        message: name, 
        time: Date.now
    });
}

const User = mongoose.model('Blogs', BlogBodySchema);
module.exports = User;