const controllers = require('../controllers');
const router = require('express').Router();

const auth = require('../utils/auth');

router.get('/create', auth(), controllers.expense.get.create);
router.post('/create', auth(), controllers.expense.post.create);

router.get('/report/:expenseId', auth(), controllers.expense.get.report);
router.get('/delete/:expenseId', auth(), controllers.expense.get.delete);
router.get('/all', auth(), controllers.expense.get.all);
router.post('/refill', auth(), controllers.expense.post.refill);

module.exports = router;
