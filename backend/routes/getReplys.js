const express = require('express');
const fetchUserID = require('../middleware/fetchUserId');
const logger = require("../logger/logger");
const Blog = require('../models/body.model');
const Reply = require('../models/reply.model');
const authenticateJWT = require('../middleware/jwt');

const router = express.Router();

/**
 * @swagger
 * /replys:
 *   get:
 *     summary: Fetch an array of comments.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: query
 *         name: parentcommentorreplyid
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
router.get('/replys', async (req, res) => {
    logger.info(`NEW GET REQUEST: /comments`);

    var parentCommentIdValue = req.headers['parentCommentOrReplyId'];  
    
    try {

        // Get the start and end values from headers
        const countOfFirstDocumentsToSkip = parseInt(req.headers['skip'], 10) || 0;  // Default to 0 if not provided
        const countOfNextDocumentsToFetch = parseInt(req.headers['fetch'], 10) || 10;   // Default to 10 if not provided

        // Fetch only the replys within the specified range using limit and offset
        const result = await Reply.find(
            {parentCommentId: parentCommentIdValue}, 
            null,  
            {   
                skip:  countOfFirstDocumentsToSkip,  // no of replys to skip 
                limit: countOfNextDocumentsToFetch   // no of replys to fetch after skiping 
            }
        );

        return res.status(200).send({
            "message" : `Successfully Fetched Replys`, 
            "body": result 
        });

    } catch (err) {
        logger.error(err)
        return res.status(500).send({ "message": "Error retrieving replys" });
    }
});


module.exports = router;