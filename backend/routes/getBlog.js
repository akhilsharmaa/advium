const express = require('express');
const fetchUserID = require('../middleware/fetchUserId');
const logger = require("../logger/logger");
const Blog = require('../models/body');
const authenticateJWT = require('../middleware/jwt');
const User = require('../models/user');

const router = express.Router();

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
            result: {
                "title": blog.title, 
                "markdown_body": blog.markdown_body, 
                "tags":   blog.tags, 
                "thumbnailBase64": blog.thumbnailBase64, 
                "secondaryThumbnailBase64": blog.secondaryThumbnailBase64
            }
        }
    );
    
});


module.exports = router;