const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = page * limit - limit; // 0,10,20,30
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }

  db.query(
    `SELECT p.id, p.title, p.image, p.price, p.short_desc, p.quantity,
        c.title as category, p.cat_id FROM products p JOIN categories c ON
            c.id = p.cat_id 
            ORDER BY p.id ASC
            LIMIT ${startValue}, ${limit}`,
    (err, results) => {
      if (err) console.log(err);
      else res.json(results);
    }
  );
});

// GET SINGLE PRODUCT BY ID
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  db.query(
    `SELECT p.id, p.title, p.image, p.images, p.description, p.price, p.quantity, p.short_desc,
        c.title as category, p.cat_id FROM products p JOIN categories c ON
            c.id = p.cat_id WHERE p.id = ${productId}`,
    (err, results) => {
      if (err) console.log(err);
      else res.json(results[0]);
    }
  );
});

router.post("/add", async (req, res) => {
  const { title, description, short_desc, image, price, quantity, cat_id } = req.body;

  // Validate required fields
  if (!title || !description || !short_desc || !image || !price || !quantity || !cat_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Insert the new product into the database
  const query = "INSERT INTO products (title, description, short_desc, image, price, quantity, cat_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [title, description, short_desc, image, price, quantity, cat_id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error inserting the product" });
    }

    return res.status(201).json({ message: "Product added successfully", productId: results.insertId });
  });
});

router.post("/update", async (req, res) => {
  const { id, title, description, short_desc, image, price, quantity, cat_id } = req.body;

  // Validate required fields
  if (!title || !description || !short_desc || !image || !price || !quantity || !cat_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Insert the new product into the database
  const query = "UPDATE products SET title = ?, description = ?, short_desc = ?, image = ?, price = ?, quantity = ?,cat_id = ? WHERE id = ?;";
  const values = [title, description, short_desc, image, price, quantity, cat_id, id];

  db.query(query, values, (err, results) => {
    console.log(results)
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error updating the product" });
    }

    return res.status(201).json({ message: "Product updated successfully", productId: results.insertId });
  });
});

router.post("/categories", async (req, res) => {
  db.query(
    `SELECT * FROM categories`,
    (err, results) => {
      if (err) console.log(err);
      else res.json(results);
    }
  );
});

module.exports = router;
