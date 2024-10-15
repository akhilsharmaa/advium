// User.js
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require('../logger/logger');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  assets: []
});


// Method to generate a hash from plain text
UserSchema.methods.createHash = async function (plainTextPassword) {

  // Hashing user's salt and password with 10 iterations,
  const saltRounds = 10;

  // First method to generate a salt and then create hash
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainTextPassword, salt);
};

UserSchema.methods.generateAuthToken = function () {
  const token =  jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY).toString();;
  return token;  
};

// Validating the candidate password with stored hash and hash function
UserSchema.methods.validatePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// Validating the candidate password with stored hash and hash function
UserSchema.methods.insertNewAssetUsed = async function (publicUrl) {
  try {
    
    this.assets.push({
      url: publicUrl, 
      time: Date.now()
    });

    //** Save the updated document to the database
    await this.save();
    logger.info(`Success: Asset ${publicUrl.substring(0, 20)} successfully added to user assets database.`);

  } catch (error) {
    logger.error(`Error adding asset ${publicUrl} to user assets: ${error.message}`);
    throw error; // Optionally rethrow to handle it elsewhere
  }
};

const User = mongoose.model('Users', UserSchema);
module.exports = User;