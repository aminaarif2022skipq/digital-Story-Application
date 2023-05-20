const express = require('express');
const router = express.Router();
const addComment = require('../controllers/addComment');
const updateComment = require('../controllers/updateComment');
const getComment = require('../controllers/getComment');
const getStoryComments = require('../controllers/getStoryComments');
const deleteComment = require('../controllers/deleteComment');

// add a comment
router.post('/:id',addComment);

//update a comment
router.put('/:id',updateComment);

//read a comment
router.get('/find/:id',getComment);

//delete a comment
router.delete('/:id',deleteComment);

//get all comments for a story
router.get('/all/:id',getStoryComments);


module.exports = router;