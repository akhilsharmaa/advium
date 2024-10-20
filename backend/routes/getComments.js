const express = require('express');
const fetchUserID = require('../middleware/fetchUserId');
const logger = require("../logger/logger");
const Blog = require('../models/body.model');
const Comment = require('../models/comment.model');
const authenticateJWT = require('../middleware/jwt');

const router = express.Router();

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Fetch an array of comments.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: query
 *         name: blog
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog to retrieve comments for.
 *       - in: query
 *         name: skip
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of comments to skip.
 *       - in: query
 *         name: fetch
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of comments to fetch from the database.
 *     responses:
 *       200:
 *         description: A list of comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *       500:
 *         description: Internal server error.
 */
router.get('/comments', async (req, res) => {

    var blogIdValue = req.headers['blog'];  
    logger.info(`NEW GET REQUEST: /comments for ${blogIdValue}`);

    var blog = await Blog.findById(blogIdValue); // Check if the blog exists
    if (!blog) 
        return res.status(401).send({ "message": "Invalid Blog!" });

    
    try { 

    } catch (err) {
        logger.error(err);
        return res.status(500).send({ "message": "Error finding the blog" });
    }

    try {

        // Get the start and end values from headers
        const countOfFirstCommentsToSkip = parseInt(req.headers['skip'], 10) || 0;  // Default to 0 if not provided
        const countOfNextCommentsToFetch = parseInt(req.headers['fetch'], 10) || 10;   // Default to 10 if not provided

        // Fetch only the comments within the specified range using limit and offset
        const comments = await Comment.find(
            {blogId: blogIdValue}, null,  
            {   
                skip:  countOfFirstCommentsToSkip,  // no of comments to skip 
                limit: countOfNextCommentsToFetch   // no of comments to fetch after skiping 
            }
        );

        return res.status(200).send(comments);

    } catch (err) {
        logger.error(err)
        return res.status(500).send({ "message": "Error retrieving comments" });
    }
});


module.exports = router;