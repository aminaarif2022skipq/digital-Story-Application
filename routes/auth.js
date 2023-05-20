const express = require('express');
const router = express.Router();
const createNewUser = require('../controllers/regsiter.js');
const loginInUser = require('../controllers/auth.js');
const handleRefreshToken = require('../controllers/refreshToken.js')

//signup
router.post('/register',createNewUser);

//signin
router.post('/signIn',loginInUser);

//token refresh
router.get('/refresh',handleRefreshToken)



module.exports = router;