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
 *     summary: Get a blog post by its ID
 *     description: Fetch a blog post using its ID. If the blog is private, authentication is required to view the content.
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: header
 *         name: blog
 *         schema:
 *           type: string
 *         required: true
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
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: My Awesome Blog
 *                     markdown_body:
 *                       type: string
 *                       example: This is the body of the blog in markdown format.
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["tech", "nodejs"]
 *                     thumbnailBase64:
 *                       type: string
 *                       description: Base64 encoded primary thumbnail image
 *                     secondaryThumbnailBase64:
 *                       type: string
 *                       description: Base64 encoded secondary thumbnail image
 *       401:
 *         description: Unauthorized or Blog Not Found.
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
 *                   example: You are not authorized to view this blog
 *       500:
 *         description: Internal server error.
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