const express = require('express');
const logger = require("../../logger/logger");
const Blog = require('../../models/body.model');
const { createClient } = require('redis');
const {blogCardObject, listOfBlogsByDateObject} = require("../../constants/redisObects.js");
// const {} = require("../../utils/redis/serializer.js")
// const {deserializer} = require("../../utils/redis/deserializer.js")

const router = express.Router();
const redisClient = createClient();

const expiryInSeconds = 60; 

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
        await redisClient.connect();

        // (async () => {
        //     try {
        // Clear all data in Redis
        //         await redisClient.flushAll();
        //         console.log('All data in Redis has been cleared');
        //         await redisClient.quit(); // Optional: Close the Redis connection after clearing
        //         return res.status(200).send({
        //             "message" : `Successfully Fetched Blogs`, 
        //             "body": [] 
        //         });
        //     } catch (err) {
        //         console.error('Error clearing Redis:', err);
        //     }
        // })();

        console.log("[🐸] Redis connected");

        // Get the start and end values from headers
        const countOfFirstBlogsToSkip = parseInt(req.headers['skip'], 10) || 0;  // Default to 0 if not provided
        const countOfNextBlogsToFetch = parseInt(req.headers['fetch'], 10) || 6; // Default to 6 if not provided

        const resultFromCache = await getBlogsFromCache(countOfFirstBlogsToSkip);
        // console.log("resultFromCache:", resultFromCache);
        
        if(resultFromCache && resultFromCache.length > 0){

            if(redisClient.isOpen)
                await redisClient.quit();

            return res.status(200).send({
                "message" : `Successfully Fetched Blogs From Cache`, 
                "body": resultFromCache 
            });
        }else {
            console.log("[*] DB Need Called Blog.find()");
        }

        // Fetch only the comments within the specified range using limit and offset
        const blogs = await Blog.find(
            null, 
            { 
                authorId: true,   
                title: true,
                time: true, 
                authorId: true, 
            },  
            {   
                skip:  countOfFirstBlogsToSkip,  // no of blogs to skip 
                limit: countOfNextBlogsToFetch,  // no of blogs to fetch after skiping 
                sort: { time: -1 }              // sort by "time" in descending order (-1 for descending, 1 for ascending)
            }
        );

        console.log("[*] DB Called Blog.find()");

        // ** CHECHING THE FETCHED BLOG 
        await addBlogsToCache(blogs, countOfFirstBlogsToSkip);

        // Close the Redis connection when done
        if(redisClient.isOpen){
            await redisClient.quit();
            // console.log("[X] Redis Quit");
        }

        return res.status(200).send({
            "message" : `Successfully Fetched Blogs`, 
            "body": blogs 
        });

    } catch (err) {

        try {
            // Ensure Redis connection is closed in case of an error
            await redisClient.quit();
        } catch (quitErr) {
            logger.error('Error closing Redis connection:', quitErr);
        }

        console.error(err)
        return res.status(500).send({ "message": "Error retrieving Blogs" });
    }

});


const addBlogsToCache = async (blogs, countOfFirstBlogsToSkip) => {
        
        if(blogs.length == 0){
            return; 
        }

        const blogIds = []

        blogs.map((blog) => {
            blogIds.push(blog._id.toString())
        })

        try{
            // Delete the existing list if it exists
            await redisClient.del(listOfBlogsByDateObject(countOfFirstBlogsToSkip));

            // Pusing all the ids in the list
            await redisClient.rPush(listOfBlogsByDateObject(countOfFirstBlogsToSkip), blogIds);

        }catch (err){            
            console.error(err);
            throw err; 
        }
         
        try { 

            blogs.map(async (blog) => {

                await redisClient.hSet(
                    blogCardObject(blog._id), // Redis key for the blog object
                    {
                        authorId: blog.authorId,   // Storing the author's ID
                        title: blog.title,         // Storing the blog's title
                        time: blog.time.toString(),// Storing the blog's time
                    }, 
                    expiryInSeconds
                );
            
                logger.info(`Redis Cached: ${blogCardObject(blog._id)}:${blog._id}`);
            });

        }catch (err){ 
            throw err; 
        }


}

const getBlogsFromCache = async (countOfFirstBlogsToSkip) => {

    try {
        // Get all blogIds from Redis
        const blogIds = await redisClient.lRange(
            listOfBlogsByDateObject(countOfFirstBlogsToSkip), 0, -1
        );

        let blogs = [];
        console.log("blogIds:", blogIds);

        // Use Promise.all to fetch blog details in parallel
        const blogPromises = blogIds.map(async (blogId) => {
            try {
                const result = await redisClient.hGetAll(blogCardObject(blogId));                
                return {
                    "authorId": result["authorId"],
                    "title": result["title"],
                    "time": result["time"]
                };
            } catch (err) {
                console.error(`Failed to fetch blog with id ${blogId}:`, err);
                return null; // Continue the process even if one fetch fails
            }
        });

        // Wait for all blog details to be fetched
        const blogsResults = await Promise.all(blogPromises);

        // Filter out any null entries (in case of fetch failure)
        blogs = blogsResults.filter(blog => blog !== null);

        console.log("blogs:", blogs.length);
        return blogs;

    } catch (err) {
        console.error("Error fetching blogs from cache:", err);
        return null;
    }
}


module.exports = router;