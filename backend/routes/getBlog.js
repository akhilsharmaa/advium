const express = require('express');
const fetchUserID = require('../middleware/fetchUserId');
const logger = require("../logger/logger");
const Blog = require('../models/body');
const authenticateJWT = require('../middleware/jwt');
const User = require('../models/user');

const router = express.Router();

/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Fetch a blog by its ID
 *     description: Retrieve a blog based on the provided blog ID in the request headers. Handles both public and private blogs.
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: header
 *         name: blog
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog to retrieve.
 *     responses:
 *       200:
 *         description: Successfully fetched the blog.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully fetched the blog
 *                 result:
 *                   type: object
 *                   description: The blog object.
 *                   properties:
 *                     authorId:
 *                       type: string
 *                       example: "author123"
 *                     title:
 *                       type: string
 *                       example: "My First Blog"
 *                     markdown_body:
 *                       type: string
 *                       example: "This is the blog content."
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["coding", "javascript"]
 *                     thumbnailBase64:
 *                       type: string
 *                       example: "base64encodedthumbnail"
 *                     secondaryThumbnailBase64:
 *                       type: string
 *                       example: "base64encodedthumbnail2"
 *                     visiblity:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     time:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-12T14:48:00.000Z"
 *       401:
 *         description: Access denied or blog not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access Denied!
 *                 error:
 *                   type: string
 *                   example: "You are not authorized to view this blog"
 */

router.get('', async (req, res) => {
    
    logger.info(`NEW REQUEST: /blog `);
    
    let blog; 

    try { 
        blog = await Blog.findById(req.headers['blog']);
    }catch(error){
        return res.status(401).send({"message": "No Blog Found, Retry later", "error": error});
    } 
        
    const userId = fetchUserID(req);

    if(!blog.visiblity){ // blog is private 
        if(!userId){
            return res.status(401) .send({
                "message": "Login to view content", 
                "error": "No Authentication Token Found"
            });
        }
        //** Checking If The User is  */
        if(blog.authorId !== userId){
            return res.status(401) .send({
                "message": "Access Denied!", 
                "error": "You are not authorized to view this blog"
            });
        }
    };

    return res.status(200).send(
        {   message: "Successfully fetched the blog", 
            result: blog
        }
    );
    
});


module.exports = router;