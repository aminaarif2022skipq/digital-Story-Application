const express = require("express");
const router = express.Router();
const getReaction = require("../controllers/getReaction.js");
const deleteReaction = require("../controllers/deleteReaction.js");
const handleReactionsReceived = require("../controllers/userStoriesThatReceivedReactions.js");
const getUserReactions = require("../controllers/getUserReactions.js");

//read a reaction
router.post("/:id", getReaction);

//delete a reaction
router.delete("/:id", deleteReaction);

//which stories a particular user has reacted to
router.get("/user", getUserReactions);

//which of his stories other user has reacted to
router.get("/received/:id", handleReactionsReceived);

module.exports = router;
