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

    // TODO: set up websocket subscriptions to game and gameUser

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

    const deck = generateDeck();
    let gameUsers = await getAllUsersInGame(gameId);
    const shuffledGameUsers = shuffle(gameUsers);

    await Promise.all(
      shuffledGameUsers.map(async (gameUser, idx) => {
        const hand = [];
        for (let i = 0; i < 6; i++) {
          hand.push(deck.pop());
        }

        return await pool.query(
          'UPDATE "gameUsers" SET "hand" = $1, "order" = $2 WHERE "id" = $3 RETURNING *',
          [hand, idx, gameUser.id]
        );
      })
    );

    const newRoundId = uuidv4();
    const newRoundResponse = await pool.query(
      'INSERT INTO rounds (id, "activeUserId", "roundNum") VALUES ($1, $2, $3) RETURNING *',
      [newRoundId, shuffledGameUsers[0].userId, 0]
    );
    const currentRoundId = newRoundResponse.rows[0]?.id;

    if (!currentRoundId) throw new Error("currentRoundId is not valid");

    const updateGameResponse = await pool.query(
      'UPDATE "games" SET "gameMode" = $1, "numPoints" = $2, "isStarted" = $3, "currentRoundId" = $4, "deck" = $5, "discardPile" = $6, "numUsers" = $7 WHERE "id" = $8 RETURNING *',
      [
        gameMode,
        numPoints,
        true,
        currentRoundId,
        deck,
        [],
        shuffledGameUsers.length,
        gameId,
      ]
    );

    // TODO: publish players their new cards, game and round
    res.json({
      game: updateGameResponse.rows[0],
      round: newRoundResponse.rows[0],
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:gameKey?/init-round", async (req, res, next) => {
  try {
    const gameKey = req.params?.gameKey;
    const { cardNum, prompt } = req.body;

    const game = await getGameFromGameKey(gameKey);

    if (!game || prompt || cardNum === undefined)
      throw new Error("game, prompt and card num is required!");

    const updateRoundResponse = await pool.query(
      'UPDATE "rounds" SET "currentCardNum" = $1, "currentPrompt" = $2, "gameStage" = $3 WHERE "id" = $4 RETURNING *',
      [cardNum, prompt, 1, game.currentRoundId]
    );

    res.json(updateRoundResponse.rows[0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:gameKey?/submit-card", async (req, res, next) => {
  try {
    const userId = req.headers.user;
    const gameKey = req.params?.gameKey;
    const { cardNum } = req.body;

    if (!userId || cardNum === undefined)
      throw new Error("user id and card num is required");

    const game = getGameFromGameKey(gameKey);

    const newUserRoundActionId = uuidv4();
    const createUserRoundActionResponse = await pool.query(
      'INSERT into "userRoundActions" ("id", "userId" "roundId", "submittedCardNum") VALUES ($1, $2, $3, $4) RETURNING *',
      [newUserRoundActionId, userId, game.currentRoundId, cardNum]
    );

    const allCurrentRoundActionsResponse = await pool.query(
      'SELECT * from "userRoundActions" WHERE "roundId" = $1',
      [game.currentRoundId]
    );

    const usersAwaitingSubmissionCount = game.numUsers;
    if (
      allCurrentRoundActionsResponse.rowCount === usersAwaitingSubmissionCount
    ) {
      // TODO: publish new round response
      await pool.query(
        'UPDATE "rounds" SET "gameStage" = $1 WHERE "id" = $2 RETURNING *',
        [2, game.currentRoundId]
      );
    }

    res.json(createUserRoundActionResponse.rows[0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:gameKey?/choices", async (req, res, next) => {
  try {
    const gameKey = req.params?.gameKey;

    const game = getGameFromGameKey(gameKey);
    const allCurrentRoundActionsResponse = await pool.query(
      'SELECT * from "userRoundActions" WHERE "roundId" = $1',
      [game.currentRoundId]
    );

    return res.json(allCurrentRoundActionsResponse.rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:gameKey?/submit-guess", async (req, res, next) => {
  const userId = req.headers.user;
  const gameKey = req.params?.gameKey;
  const { cardNum } = req.body;

  if (!userId || cardNum === undefined)
    throw new Error("user id and card num is required");

  const game = getGameFromGameKey(gameKey);

  const updateUserRoundActionsResponse = await pool.query(
    'UPDATE "userRoundActions" SET "submittedCardNum" = $1 WHERE "roundId" = $2 AND "userId" = $3 RETURNING *',
    [game.currentRoundId, userId]
  );

  const allCurrentRoundActionsResponse = await pool.query(
    'SELECT * from "userRoundActions" WHERE "roundId" = $1 AND "submittedCardNum" IS NOT NULL',
    [game.currentRoundId]
  );

  const usersAwaitingSubmissionCount = game.numUsers - 1;
  if (
    allCurrentRoundActionsResponse.rowCount === usersAwaitingSubmissionCount
  ) {
    // TODO: publish new round response
    await pool.query(
      'UPDATE "rounds" SET "gameStage" = $1 WHERE "id" = $2 RETURNING *',
      [3, game.currentRoundId]
    );
  }

  res.json(updateUserRoundActionsResponse.rows[0]);
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// TODO: wait for everyone to hit next, determine if game is done
router.post("/:gameKey?/ready", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
