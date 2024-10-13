const express = require('express');

const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const dotenv = require("dotenv")
const authenticateJWT = require('../middleware/jwt');
const sharp = require("sharp");
const bcrypt = require("bcrypt");
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const logger = require("../logger/logger");
const User = require("../models/user");

const router = express.Router();

const s3 = new S3Client({
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY, 
        secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.S3_BUCKET_REGION
})

router.post('',  upload.single('image'), authenticateJWT, async (req, res) => {
    
    logger.info(`NEW REQUEST: /profile `);
    
    try {

        //** Resizing the image file for efficient storage */
        const resizedImageBuffer = await sharp(req.file.buffer)
                                            .resize({
                                                width: 1920, 
                                                fit: sharp.fit.contain, // Maintain aspect ratio while fitting
                                                withoutEnlargement: true // Prevent upscaling
                                            }).toBuffer();
                                                
        const generatedName = String(bcrypt.genSaltSync(10)); 
        const generatedFileKey = `assets/${req.body.userid}/${generatedName}`; 

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,  
            Key:  generatedFileKey, 
            Body: resizedImageBuffer,           
            ContentType: req.file.mimetype // file type (jpeg/image)
        })
        
        await s3.send(command).then(()=> {
            logger.info(`Success: S3BUCKET(PutObject) ADDED "${command.input.Key}" to the S3 bucket.`);
        });

        // Get The Object from s3 command
        const get_command = await new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,  
            Key: generatedFileKey,
        })
        
        // ** Getting the PUBLIC URL of the image /
        const publicUrl = await getSignedUrl(s3, get_command, {
            // Set of all x-amz-* headers you wish to have signed
            unhoistableHeaders: new Set(["x-amz-checksum-sha256"]),
        }).then(()=> {
            logger.info(`Success: S3BUCKET(getSignedUrl) Fetched PUBLIC URL of "${get_command.input.Key}" from S3 bucket.`);
        });;

        //** Added the file name to the user database (so that can be fetch later) */
        const currentUser = await User.findById(req.body.userid);
        currentUser.insertNewAssetUsed(generatedFileKey, publicUrl);
        currentUser.save();

        return res.status(200).send({
            "message" : "File Uploaded Successfully", 
            "imageUrl" : publicUrl
        })

    }catch(error){
        logger.error(error);
        return res.status(400) .send({
            "message": "File Upload Failed! Retry later", 
            "error": error
        });
    }
})

module.exports = router;