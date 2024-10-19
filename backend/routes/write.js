const express = require('express');
const cors = require('cors');
const BlogBodySchema = require('../models/body.model');
const authenticateJWT = require('../middleware/jwt');
const logger = require("../logger/logger");
const useTag = require("../utils/usetag");

const router = express.Router();

/**
 * @swagger
 * /write/new:
 *   post:
 *     summary: Create a new blog post
 *     description: This endpoint allows an authenticated user to create a new blog post. The request must include a valid JWT token in the Authorization header.
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My First Blog Post"
 *               markdown_body:
 *                 type: string
 *                 example: "# This is my first blog post\nHere is some content..."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "programming"
 *               thumbnailBase64:
 *                 type: string
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
 *               secondaryThumbnailBase64:
 *                 type: string
 *                 example: "data:image/png;base64,iVB123123sdfAANSUhEUgAAAAUA..."
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

router.post('/new', authenticateJWT, async (req, res) => {
    logger.info(`NEW REQUEST: /new by ${req.body.userid}, ${req.body.title}`)

    // Create a new BlogBody object based on the request body data
    const newBlogBody = new BlogBodySchema({
        authorId: req.body.userid,
        title: req.body.title,
        markdown_body: req.body.markdown_body,
        tags : req.body.tags,
        thumbnailBase64: req.body.thumbnailBase64, 
        secondaryThumbnailBase64: req.body.secondaryThumbnailBase64
    });

    try {
        
        // These methods initialize author ID, timestamp, and status initialization
        newBlogBody.initializeAuthorId(req.body.userid);
        newBlogBody.initializeTime();
        newBlogBody.initializeStatus();

        // Save the new blog body to the database
        const result =  await newBlogBody.save();         
        logger.info(`🚀 New Blog Pushed!  BlogId:  ${newBlogBody._id} ${result}`)

        // Insert Blog Tags 
        await newBlogBody.tags.forEach(tagname => {
            try {
                useTag(
                    tagname=tagname, 
                    blogId=newBlogBody._id
                );
            }catch (error) {
                return res.status(400).send({
                    message: error.message
                });
            }
        });

        return res.status(200).json({ 
            "message": "Blog Created Successfully", 
            "blogBodyId": newBlogBody._id
        });

    } catch (error) {
            
        return res.status(400).send({
            message: error.message
        }); 
    }
});


module.exports = router;