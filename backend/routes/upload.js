const express = require('express');

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv")
const authenticateJWT = require('../middleware/jwt');
const sharp = require("sharp");
const bcrypt = require("bcrypt");
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const logger = require("../logger/logger");

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
                                                
        const randomImageName = String(bcrypt.genSaltSync(10)); 

        
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,  
            Key: `assets/${req.body.userid}/${randomImageName}`, 
            Body: resizedImageBuffer,           
            ContentType: req.file.mimetype // file type (jpeg/image)
        })
        
        await s3.send(command).then(()=> {
            logger.info(`Success: S3BUCKET(PutObject) ADDED "${command.input.Key}" to the S3 bucket.`);
        });

    }catch(error){
        logger.error(error);
        return res.status(400) .send({
            "message": "File Upload Failed! Retry later", 
            "error": error
        });
    }

    return res.status(200).send({
        "message" : "File Uploaded Successfully"
    })
})

module.exports = router;