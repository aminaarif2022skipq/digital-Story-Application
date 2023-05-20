const express = require("express");
const router = express.Router();
const getAllUserDetails = require("../controllers/getAllUsers");
const handleUserLogout = require("../controllers/logout");
const getSingleUser = require('../controllers/getSingleUser');
const updateUser = require('../controllers/updateUser');
const deleteUser = require('../controllers/deleteUser');
const updateTotalNumberOfStories = require('../controllers/updateTotalNoOfStories')

//get all users
router.get("/all", getAllUserDetails);

//logout 
router.get("/logout",handleUserLogout);

//get single user
router.get('/find/:id',getSingleUser);

//update single user
router.put('/:id', updateUser);

 //delete user
router.delete('/:id',deleteUser);

module.exports = router;
