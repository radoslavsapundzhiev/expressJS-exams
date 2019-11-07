const controllers = require('../controllers');
const router = require('express').Router();
const auth = require('../utils/auth');


router.get('/login', controllers.user.get.login);
router.get('/register', controllers.user.get.register);
router.get('/logout', controllers.user.get.logout);
router.get('/profile', auth(), controllers.user.get.profile);

router.post('/login', controllers.user.post.login);
router.post('/register', controllers.user.post.register);

module.exports = router;