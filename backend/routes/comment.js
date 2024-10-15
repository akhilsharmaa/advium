const express = require('express');
const cors = require('cors');
const Comment = require('../models/comment.model')
const Blog = require('../models/body.model')
const authenticateJWT = require('../middleware/jwt');
const logger = require("../logger/logger");
const User = require('../models/user.model');


const router = express.Router();


/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Add new Comment
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
 *               blogId:
 *                 type: string
 *                 example: "670a4dd5a99043dac32eb647"
 *               comment:
 *                 type: string
 *                 example: "This is a log comment which is a apreciation for the blog content"
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment Successfully"
 */

router.post('/comment', authenticateJWT, async (req, res) => {
    logger.info(`NEW REQUEST: /comment by ${req.body.userid}`)
    

    //** Checking User: if the blog exist or not in the database */
    try{ 
        var user = await User.findById(req.body.userid);
        if(!user) 
            return res.status(401) .send({"message": "Invalid User, No User Found."});
    }catch(err){
        return res.status(401) .send({"message": "Invalid User, No User Found.", "error": err});
    }


    //** Checking Blog: if the blog exist or not in the database */
    try{ 
        var blog = await Blog.findById(req.body.blogId);
        if(!blog) 
            return res.status(401) .send({"message": "Invalid Blog, No Blog Found."});
    }catch(err){
        return res.status(401) .send({"message": "Invalid Blog, No Blog Found.", "error": err});
    }


    try{
        const newComment = new Comment({
            blogId: blog._id, 
            authorId: user._id, 
            authorFirstName: user.firstName, 
            authorLastName: user.lastName, 
            content: req.body.comment, 
        });

        const result = await newComment.save();  // Insert the blog 
        if(result){
            return res.status(200).send({"message": "Commented Successfully"});
        }
    }catch(err){
        logger.error(err);
        return res.status(401) .send({"message": "Failed Comment!", "error": err});
    }


    return res.status(500).send({"message": "Something Went wrong"});

});


module.exports = router;