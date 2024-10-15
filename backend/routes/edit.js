const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authenticateJWT = require('../middleware/jwt');
const logger = require("../logger/logger");
const Blog = require('../models/body.model');
const useTag = require("../utils/usetag");


const router = express.Router();


/**
 * @swagger
 * /write/edit:
 *   post:
 *     summary: Edit The Blog (include blog id)
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
 *               blogId:
 *                 type: string
 *                 example: "670a4dd5a99043dac32eb647"
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

router.post('/edit', authenticateJWT, async (req, res) => {
    logger.info(`NEW REQUEST: /edit by ${req.body.userid}`)

    let blog; 

    try{
        blog =  await Blog.findById(req.body.blogId);
        // Check if blog current user is author of the requested blog 
        if(req.body.userid != blog.authorId)
            return res.status(400).send({"message": "Editing Access denied"});
    }catch(error){
        return res.status(401) .send({"message": "No Blog Found, Retry later", "error": error});
    }

    /*  Assigning new values of 
        (title, markdown, tags, thumbnail, secondarythumbnail) */
        
    blog.title = req.body.title; 
    blog.markdown_body = req.body.markdown_body;
    blog.tags = req.body.tags;
    blog.thumbnailBase64 = req.body.thumbnailBase64;
    blog.secondaryThumbnailBase64 = req.body.secondaryThumbnailBase64;
    blog.addNewStatus("Edited"); // pushing new status


    // Insert Blog Tags 
    try{
        await blog.tags.forEach(tagname => useTag(tagname=tagname, blogId=req.body.blogId));
    }catch(error){
        return res.status(400) .send({"message": "Fail to add tags, Retry later", "error": error});
    }
 
    try{
        // Save the edited blog body to the database
        await blog.save();         
        logger.info(`💾 Edited Blog Pushed!  BlogId:  ${blog._id}`)

        return res.status(200).json({ 
            "message": "Blog Edited Successfully", 
            "blogBodyId": blog._id
        });
    }catch(error){
        return res.status(400).send({"message": `Failed To save Edit`, "error": error});
    }

});


module.exports = router;