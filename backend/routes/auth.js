const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

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
    
    console.log(req.body);

    const newUser = new User({
      firstName: req.body.firstName,
      lastName:  req.body.lastName,
      email:  req.body.email,
      password: req.body.password,
    });
    
    // Hash the password before saving the user
    const saltRounds = 10; // Cost factor for hashing
    newUser.password = await bcrypt.hash(newUser.password, saltRounds);
    
    try {
      const savedUser = await newUser.save();
      console.log('User created:', savedUser);
      
    } catch (error) {
      console.error('Error creating user:', error);
    
      const formattedError = {
        message: error.message
      };
      
      res.status(400).send(formattedError); 
      return;
    }

    res.status(200).send("User Created Successfully");
});



/**
 * @swagger
 * /auth/{id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: A single user
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.send(`Get user with ID ${id}`);
});

module.exports = router;
