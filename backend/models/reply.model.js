// User.js
const mongoose = require('mongoose');
const logger = require('../logger/logger');

const ReplySchema = new mongoose.Schema({
    
    parentCommentId: {
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


const Reply = mongoose.model('replys', ReplySchema);
module.exports = Reply;