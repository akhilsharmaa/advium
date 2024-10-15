const mongoose = require('mongoose');
const cors = require('cors');
const Tag = require('../models/tag.model');
const logger = require("../logger/logger");



async function useTag(tagname, blogId){
    
    tagname = tagname.toLowerCase();
    let tag = await Tag.findOne({ name: tagname });
    
    if(!tag){   // If tag no exist with this tagname : creating the tagname

        const newTag = new Tag({
            name: tagname, 
            usedIn: []
        });

        try {
            
            newTag.usedByBlog(blogId);
            await newTag.save(); 

            logger.info(`🏷️  New TagName Created & USED name "${tagname}" in blogId: ${blogId}`)
            return { success: true, message: "Tag applied successfully" };
        }catch(error){
            throw new Error(error);
        }
    }

    try {

        tag.usedByBlog(blogId);
        tag.save(); 

    } catch (error) {
        throw new Error(error);    
    }
    
    return { success: true, message: "Tag applied successfully" };

};

module.exports = useTag;