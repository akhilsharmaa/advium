const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
var asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const cors = require('cors');
const authenticateJWT = require('../middleware/jwt');


const router = express.Router();
require('dotenv').config()

const connect = async () => {
  try{
    mongoose.connect(process.env.MONGODB_URL);
    console.log("[🦊] MongoDB Atlas connected");
  }catch(err){
    console.log(err);
  }
}
connect();


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new user
 *     description: This endpoint allows you to create a new user account.
 *     tags:
 *       - Authentication  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: User created successfully.
 *       400:
 *         description: Bad request, invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.post('/signup', async (req, res) => {

    const newUser = new User({
      firstName: req.body.firstName,
      lastName:  req.body.lastName,
      email:     req.body.email,
      password: req.body.password, 
    });

    // Hash the password before saving the user
    var hashedPassword = await newUser.createHash(newUser.password);
    newUser.password = hashedPassword;
    
    try {
      await newUser.save();
    } catch (error) {

      console.error('Error creating user:', error);
      const formattedError = {
        message: error.message
      };
      
      return res.status(400).send(formattedError); 
    }

    return res.status(200).json(
      { 
        "message": "user registered successfully", 
        "token": newUser.generateAuthToken()
      }
    );
});




/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: SignIn as Registed User 
 *     description: This endpoint allows you to create a new user account.
 *     tags:
 *       - Authentication 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Logined Successfully 
 *       400:
 *         description: Bad request, invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.post('/signin', async (req, res) => {

    let user = await User.findOne({ email: req.body.email });

    if (user === null) {
      return res.status(400).json({
        message: "User not found.",
      });
    } else {
      
      if (await bcrypt.compare(req.body.password, user.password)) {
        return res.status(200).json({
          "message": "user logined successfully",
          "token": user.generateAuthToken()
        });
      } else {
        return res.status(400).json({
          message: "Incorrect Password!",
        });
      }
    }
});

/**
 * @swagger
 * /auth/changepassword:
 *   post:
 *     summary: Change User Password
 *     description: This endpoint allows a user to change their password. The request must include a valid JWT token in the Authorization header.
 *     tags:
 *       - Authentication  
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: xyz@email.com
 *               oldPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newsecurepassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized, invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

router.post('/changepassword', authenticateJWT, async (req, res) => {

    try {
      // Find user by ID (from decoded JWT token attached to req.user)
      let user = await User.findById(req.body._id);

      if (!user) {
        return res.status(400).json({
          message: "User not found.",
        });
      }

      // Check if the old password is correct
      if (await bcrypt.compare(req.body.oldPassword, user.password)) {

        // Hash the new password and update it
        const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);
        user.password = newPasswordHash;
        await user.save();

        return res.status(200).json({
          message: "Password changed successfully",
        });

      } else {
        return res.status(400).json({
          message: "Incorrect old password!",
        });
      }

    } catch (error) {
      return res.status(500).json({
        message: "Internal server error.",
        error: error.message
      });
    }
});


module.exports = router;
