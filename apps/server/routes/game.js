const { v4: uuidv4 } = require("uuid");
var express = require("express");
var router = express.Router();
const pool = require("server/db");

// TODO: how to better handle server crashing on errors?

/* GET and join game */
router.get("/:id?", async (req, res, next) => {
  try {
    const gameId = req.params?.id;
    const userId = req.headers.user;

    if (!userId || !gameId) throw new Error("user id or game id is missing");

    const userInGameResponse = await pool.query(
      `SELECT * FROM "gameUsers" WHERE 'gameId' = $1 AND 'userId' = $2`,
      [gameId, userId]
    );

    if (!userInGameResponse.rowCount) {
      console.log("hi");
      // TODO: set up new user
    }

    // TODO: return game info
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// TODO: leaving the game endpoint

// CREATE game
router.post("/", async (req, res, next) => {
  try {
    const newId = uuidv4();
    const gameKey = newId.slice(-6);

    const response = await pool.query(
      'INSERT INTO games (id, "gameKey") VALUES ($1, $2) RETURNING *',
      [newId, gameKey]
    );

    // TODO: generate user and set admin

    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// TODO: start game, pass in the settings, generate a new round, generate cards, assign cards
router.post("/:id?/start", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// TODO: submit card and prompt, update round currentPrompt, currentCardId, gameStage
router.post("/:id?/init-round", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// TODO: submit fake card for round, progress gameStage when everyone is finished
router.post("/:id?/submit-card", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// TODO: select card for round, progress gameStage when everyone is finished
router.post("/:id?/submit-guess", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// TODO: wait for everyone to hit next, determine if game is done
router.post("/:id?/ready", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
