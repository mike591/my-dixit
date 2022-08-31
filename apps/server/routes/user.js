const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");
var express = require("express");
var router = express.Router();
const pool = require("server/db");

// get user
router.get("/:id?", async (req, res, next) => {
  try {
    const id = req.params?.id;
    const response = await pool.query('SELECT * from "users" WHERE id = $1', [
      id,
    ]);

    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// create user
router.post("/", async (req, res, next) => {
  try {
    const newId = uuidv4();
    const animalType = faker.animal.type();
    const animal = faker.animal[animalType]();

    const response = await pool.query(
      'INSERT INTO "users" (id, name) VALUES ($1, $2) RETURNING *',
      [newId, animal]
    );

    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// update user
router.put("/:id?", async (req, res, next) => {
  try {
    const id = req.params?.id;
    const name = req.body?.name;
    if (!name || !id) {
      throw new Error("name and id is required!");
    }

    const response = await pool.query(
      'UPDATE "users" SET name=$1 WHERE id=$2 RETURNING *',
      [name, id]
    );

    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
