const express = require('express');
const cors = require('cors');
const Comment = require('../models/comment.model')
const Reply = require('../models/reply.model')
const Blog = require('../models/body.model')
const authenticateJWT = require('../middleware/jwt');
const logger = require("../logger/logger");
const User = require('../models/user.model');


const router = express.Router();


/**
 * @swagger
 * /reply:
 *   post:
 *     summary: Add new Reply
 *     description: This endpoint allows an authenticated user to create a new blog post. The request must include a valid JWT token in the Authorization header.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentCommentId:
 *                 type: string
 *                 example: "670a4dd5a99043dsddfeb647" 
 *               blogId:
 *                 type: string
 *                 example: "670a4dd5a99043dac32eb647"
 *               comment:
 *                 type: string
 *                 example: "This is a log comment which is a apreciation for the blog content"
 *     responses:
 *       200:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reply Successfully"
 */

router.post('/reply', authenticateJWT, async (req, res) => {
    logger.info(`NEW REQUEST: /reply by ${req.body.userid}`)

    //** Checking User is valid: if the blog exist or not in the database */
    try{ 
        var user = await User.findById(req.body.userid);
        if(!user) return res.status(401) .send({"message": "Invalid User, No User Found."});
    }catch(err){
        return res.status(401) .send({"message": "Invalid User, No User Found.", "error": err});
    }

    //** Checking Blog is valid: if the blog exist or not in the database */
    try{ 
        var blog = await Blog.findById(req.body.blogId);
        if(!blog) 
            return res.status(401) .send({"message": "Invalid Blog, No Blog Found."});
    }catch(err){
        return res.status(401) .send({"message": "Invalid Blog, No Blog Found.", "error": err});
    }


    //** Checking Comment is Valid: if the blog exist or not in the database */
    try{ 
        var reply = await Reply.findById(req.body.parentCommentId);
        var comment = await Comment.findById(req.body.parentCommentId);
        
        if(reply === null && comment === null){
            return res.status(401).send({"message": "Invalid Reply, No Parent Comment/Reply Found!"});
        }
    }catch(err){
        return res.status(401) .send({"message": "Invalid Blog, No Blog Found.", "error": err});
    }

    try{
        const newReply = new Reply({
            parentCommentId: req.body.parentCommentId, 
            blogId: blog._id, 
            authorId: user._id, 
            authorFirstName: user.firstName, 
            authorLastName: user.lastName, 
            content: req.body.comment, 
        });

        const result = await newReply.save();  // Insert the Reply
        if(result){
            return res.status(200).send({"message": "Reply Successfully"});
        }
    }catch(err){
        logger.error(err);
        return res.status(401) .send({"message": "Reply Failed!", "error": err});
    }

    return res.status(500).send({"message": "Something Went wrong"});
});


module.exports = router;