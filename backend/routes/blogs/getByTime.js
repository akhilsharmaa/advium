const express = require('express');
const logger = require("../../logger/logger");
const Blog = require('../../models/body.model');

const router = express.Router();
/**
 * @swagger
 * /blogs/sortbytime:
 *   get:
 *     summary: Fetch an array of blogs sorted by time.
 *     tags:
 *       - Fetch Blogs
 *     parameters:
 *       - in: header
 *         name: skip
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of blogs to skip.
 *       - in: header
 *         name: fetch
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of blogs to fetch.
 *     responses:
 *       200:
 *         description: A list of blogs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully Fetched Blogs
 *                 body:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *       500:
 *         description: Internal server error.
 */
router.get('/sortbytime', async (req, res) => {

    try {

        // Get the start and end values from headers
        const countOfFirstBlogsToSkip = parseInt(req.headers['skip'], 10) || 0;  // Default to 0 if not provided
        const countOfNextBlogsToFetch = parseInt(req.headers['fetch'], 10) || 6; // Default to 6 if not provided

        // Fetch only the comments within the specified range using limit and offset
        const blogs = await Blog.find(
            null, 
            null,  
            {   
                skip:  countOfFirstBlogsToSkip,  // no of blogs to skip 
                limit: countOfNextBlogsToFetch,  // no of blogs to fetch after skiping 
                sort: { time: -1 }              // sort by "time" in descending order (-1 for descending, 1 for ascending)
            }
        );

        const result = await Blog.find();

        return res.status(200).send({
            "message" : `Successfully Fetched Blogs`, 
            "body": blogs 
        });


    } catch (err) {
        logger.error(err)
        return res.status(500).send({ "message": "Error retrieving Blogs" });
    }

});


module.exports = router;