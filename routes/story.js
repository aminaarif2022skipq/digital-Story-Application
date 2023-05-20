const express = require('express');
const router = express.Router();
const createNewStory = require('../controllers/createNewStory');
const updateStory = require('../controllers/updateStory');
const getSingleStory = require('../controllers/getSingleStory');
const getAllStories = require('../controllers/getAllStories');
const getAllPublicStories = require('../controllers/getAllPublicStories');
const upvoteStory = require('../controllers/upvoteStory');
const downvoteStory = require('../controllers/downvoteStory');
const handleTrendingStories = require('../controllers/trendingStories');
const deleteStory = require('../controllers/deleteStory');


//upload a story
router.post('/',createNewStory);

//update a story
router.put('/:id',updateStory);

//read a single story
router.get('/find/:id',getSingleStory);

//delete a story
//this will be a transaction delete all doc with that story from Commment,Reaction,Story Coll
router.delete('/:id',deleteStory);

  
//get all stories for authenticated user inc public or private
router.post('/all',getAllStories);
//get all public stories
router.post('/public',getAllPublicStories);

//upvote a story
router.get('/upvote/:id',upvoteStory);
//downvote a story
router.get('/downvote/:id',downvoteStory);

// trending stories
router.get('/trending',handleTrendingStories)


module.exports = router;




