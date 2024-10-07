const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const BlogBodySchema = require('../models/blogBody');
const authenticateJWT = require('../middleware/jwt');


const router = express.Router();


/**
 * @swagger
 * /write/new:
 *   post:
 *     summary: Create a new blog post
 *     description: This endpoint allows an authenticated user to create a new blog post. The request must include a valid JWT token in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c86"  # Post ID
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

    const newBlogBody = new BlogBodySchema({
        author_id: req.body._id,
        post_id: req.body.post_id,
        title: req.body.title,
        markdown_body: req.body.markdown_body,
        tags : req.body.tags,
        thumbnailBase64: req.body.thumbnailBase64
    });

    try {
        
        newBlogBody.addNewStatus("Submitted");
        await newBlogBody.save(); 
        
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