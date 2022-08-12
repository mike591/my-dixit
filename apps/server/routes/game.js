const { v4: uuidv4 } = require("uuid");
var express = require("express");
var router = express.Router();
const pool = require("server/db");

// TODO: how to better handle server crashing on errors?

const getGameFromGameKey = async (gameKey) => {
  const gameResponse = await pool.query(
    `SELECT * FROM "games" WHERE "gameKey" = $1`,
    [gameKey]
  );

  return gameResponse.rows[0];
};

const CARD_TOTAL = 108;
const shuffle = (cards = []) => {
  const array = [...cards];

  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const generateDeck = () => {
  const cards = [];
  for (let i = 0; i < CARD_TOTAL; i++) {
    cards.push(i);
  }
  return shuffle(cards);
};

const getAllUsersInGame = async (gameId) => {
  const usersResponse = await pool.query(
    `SELECT * FROM "gameUsers" WHERE "gameId" = $1`,
    [gameId]
  );

  return usersResponse.rows;
};

/* GET and join game */
router.get("/:gameKey?", async (req, res, next) => {
  try {
    const gameKey = req.params?.gameKey;
    const userId = req.headers.user;

    if (!userId || !gameKey) throw new Error("user id or game id is missing");

    const game = await getGameFromGameKey(gameKey);
    const gameId = game?.id;

    const userInGameResponse = await pool.query(
      `SELECT * FROM "gameUsers" WHERE "gameId" = $1 AND "userId" = $2`,
      [gameId, userId]
    );

    if (!userInGameResponse.rowCount) {
      const newGameUsersId = uuidv4();
      await pool.query(
        'INSERT INTO "gameUsers" (id, "gameId", "userId", "isAdmin") VALUES ($1, $2, $3, $4) RETURNING *',
        [newGameUsersId, gameId, userId, true]
      );
    }

    // TODO: set up websocket subscriptions

    res.json(game);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// TODO: add a leaving the game endpoint

// CREATE game
router.post("/", async (req, res, next) => {
  try {
    const userId = req.headers.user;

    if (!userId) throw new Error("user id is missing");

    const newGameId = uuidv4();
    const gameKey = newGameId.slice(-6);
    const newGameResponse = await pool.query(
      'INSERT INTO games (id, "gameKey") VALUES ($1, $2) RETURNING *',
      [newGameId, gameKey]
    );

    const newGameUsersId = uuidv4();
    const newUserResponse = await pool.query(
      'INSERT INTO "gameUsers" (id, "gameId", "userId", "isAdmin") VALUES ($1, $2, $3, $4) RETURNING *',
      [newGameUsersId, newGameId, userId, true]
    );

    res.json({
      game: newGameResponse.rows[0],
      gameUser: newUserResponse.rows[0],
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:gameKey?/start", async (req, res, next) => {
  try {
    const gameKey = req.params?.gameKey;
    const { gameMode, numPoints } = req.body;

    const game = await getGameFromGameKey(gameKey);
    const gameId = game?.id;

    if (!gameId) throw new Error("Game ID is not valid");

    const newRoundId = uuidv4();
    const newRoundResponse = await pool.query(
      "INSERT INTO rounds (id) VALUES ($1) RETURNING *",
      [newRoundId]
    );
    const currentRoundId = newRoundResponse.rows[0]?.id;

    if (!currentRoundId) throw new Error("currentRoundId is not valid");

    const deck = generateDeck();
    const gameUsers = await getAllUsersInGame();

    await Promise.all(
      gameUsers.map(async (gameUser) => {
        const hand = [];
        for (let i = 0; i < 6; i++) {
          hand.push(deck.pop());
        }
        return await pool.query(
          'UPDATE "gameUsers" SET "hand"=$1 WHERE "id"=$2 RETURNING *',
          [hand, gameUser.id]
        );
      })
    );

    const updateGameResponse = await pool.query(
      'UPDATE "games" SET "gameMode"=$1, "numPoints"=$2, "isStarted"=$3, "currentRound"=$4, "deck"=$5, "discardPile"=$6 WHERE "id"=$7 RETURNING *',
      [gameMode, numPoints, true, currentRoundId, deck, [], gameId]
    );

    // TODO: check if updateGameResponse is valid, publish players their new cards?
    res.json({
      game: updateGameResponse.rows[0],
      round: newRoundResponse.rows[0],
    });
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
