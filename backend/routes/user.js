const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/', (req, res) => {
  res.send('Get all users');
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     responses:
 *       200:
 *         description: User created
 */
router.post('/', (req, res) => {
  res.send('Create a new user');
});

/**
 * @swagger
 * /users/{id}:
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
