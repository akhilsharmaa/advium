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
const User = require("../models/user.model");

const router = express.Router();

const s3 = new S3Client({
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY, 
        secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.S3_BUCKET_REGION
})

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a new asset/image. 
 *     tags:
 *       - Assets
 *     description: This endpoint uploads a user assets, resizes the image, stores it in an S3 bucket, and returns the public URL of the image. The uploaded image is also associated with the user's account in the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded.
 *     responses:
 *       200:
 *         description: File uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: File Uploaded Successfully
 *                 imageUrl:
 *                   type: string
 *                   description: The public URL of the uploaded image.
 *                   example: https://your-bucket.s3.amazonaws.com/assets/userid/imagefile.jpg
 *       400:
 *         description: File upload failed due to error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: File Upload Failed! Retry later
 *                 error:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: Error details here...
 */

router.post('',  upload.single('image'), authenticateJWT, async (req, res) => {
    logger.info(`NEW REQUEST: /profile `);
    
    const generatedName = String(bcrypt.genSaltSync(10)); 
    const generatedFileKey = `assets/${req.body.userid}/${generatedName}`; 

    try {

        //** Resizing the image file for efficient storage */
        const resizedImageBuffer = await sharp(req.file.buffer)
                                            .resize({
                                                width: 1920, 
                                                fit: sharp.fit.contain, // Maintain aspect ratio while fitting
                                                withoutEnlargement: true // Prevent upscaling
                                            }).toBuffer();
                                                

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,  
            Key:  generatedFileKey, 
            Body: resizedImageBuffer,           
            ContentType: req.file.mimetype // file type (jpeg/image)
        })
        
        await s3.send(command).then(()=> {
            logger.info(`Success: S3BUCKET(PutObject) ADDED "${command.input.Key}" to the S3 bucket.`);
        });

    }catch(error){

        logger.error(error);
        throw error; 
    
        return res.status(400) .send({
            "message": "File Upload Failed! Retry later", 
            "error": error
        });
    }

    try {

        const command = await new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,  
            Key: generatedFileKey,
        })
        
        // ** Getting the PUBLIC URL of the image /
        const publicUrl = await getSignedUrl(s3, command, {
            // Set of all x-amz-* headers you wish to have signed
            unhoistableHeaders: new Set(["x-amz-checksum-sha256"]),
        });

        logger.info(`Success: S3BUCKET(getSignedUrl) Fetched PUBLIC URL "${publicUrl.substring(0, 20)}" from S3 bucket.`);

        //** Added the file name to the user database (so that can be fetch later) */
        const currentUser = await User.findById(req.body.userid);
        currentUser.insertNewAssetUsed(publicUrl);

        return res.status(200).send({
            "message" : "File Uploaded Successfully", 
            "url" : publicUrl
        })
    }catch(error){

        logger.error(error);
        throw error; 
        
        return res.status(400).send({
            "message": "File Upload but Problem in fetch the public url of image.", 
            "error": error
        });
    }
    
})

module.exports = router;