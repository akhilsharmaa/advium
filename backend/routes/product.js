const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get('/', (req, res) => {
  res.send('Get all products');
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     responses:
 *       200:
 *         description: Product created
 */
router.post('/', (req, res) => {
  res.send('Create a new product');
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: A single product
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.send(`Get product with ID ${id}`);
});

module.exports = router;
