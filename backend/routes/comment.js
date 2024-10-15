const express = require('express');
const cors = require('cors');
const Comment = require('../models/comment')
const Blog = require('../models/body')
const authenticateJWT = require('../middleware/jwt');
const logger = require("../logger/logger");
const User = require('../models/user');


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
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog Created Successfully"
 *                 blogId:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c87"
 *       400:
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
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

        newComment.save();  // Insert the blog 
         
    }catch(err){
        logger.error(err);
        return res.status(401) .send({"message": "No Blog Found, Retry later", "error": err});
    }


    return res.status(200).send({"message": "Comment Successfully"});

});


module.exports = router;