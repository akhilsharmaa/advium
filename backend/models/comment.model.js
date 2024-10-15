// User.js
const mongoose = require('mongoose');
const User = require('./user.model');
const logger = require('../logger/logger');

const CommentSchema = new mongoose.Schema({
    
    blogId: { 
        type: String, 
        required: true 
    }, 
    authorId: { 
        type: String, 
        required: true 
    }, 
    authorFirstName: {
        type: String, 
        required: true 
    }, 
    authorLastName: {
        type: String, 
        required: true 
    }, 
    content: { 
        type: String, 
        required: true
    }, 
    edited: { 
        type: Boolean, 
        required: true, 
        default: false
    }, 
    upVotes:    [], 
    downVotes:   [], 
    time : { 
        type: Date, 
        required: true, 
        default: Date.now
    } 
});


const Comment = mongoose.model('comments', CommentSchema);
module.exports = Comment;