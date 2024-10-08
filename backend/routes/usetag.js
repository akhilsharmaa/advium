const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Tag = require('../models/tag');
const authenticateJWT = require('../middleware/jwt');
const logger = require("../logger/logger")

const router = express.Router();
/**
 * @swagger
 * write/usetag:
 *   post:
 *     summary: Use or create a tag for a blog post
 *     description: Finds an existing tag or creates a new one. If the tag doesn't exist, it will be created and associated with the blog post.
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
 *               tagname:
 *                 type: string
 *                 description: The name of the tag to use or create
 *                 example: "technology"
 *               blogId:
 *                 type: string
 *                 description: The ID of the blog post to associate with the tag
 *                 example: "60e71b2e12d7b45c5e8e46f7"
 *     responses:
 *       200:
 *         description: Tag used or created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag Used Success"
 *       400:
 *         description: Error during tag processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error message"
 */

router.post('/usetag', authenticateJWT, async (req, res) => {

    let tag = await Tag.findOne({ name: req.body.tagname });
    
    if(!tag){   // If tag no exist with this tagname : creating the tagname
        
        const newTag = new Tag({
            name: req.body.tagname, 
            usedIn: []
        });

        try {

            newTag.usedByBlog(req.body.blogId);
            await newTag.save(); 
            logger.info(`🏷️  New TagName Created & USED name "${req.body.tagname}" in blogId: ${req.body.blogId}`)

        }catch(error){
            return res.status(400).send({
                 message: error.message 
            }); 
        }

        return res.status(200).json({ 
            "message": "Tag Used Success", 
        });
    }

    try {
        
        tag.usedByBlog(req.body.blogId);
        tag.save(); 
        
        logger.info(`🏷️ TAG ${req.body.tagname} : USED SUCCESSFULLY`)
    
        return res.status(200).json({ 
            "message": "Tag Used Success", 
        });

    } catch (error) {
            
        return res.status(400).send({
            message: error.message
        }); 

    }
});


module.exports = router;