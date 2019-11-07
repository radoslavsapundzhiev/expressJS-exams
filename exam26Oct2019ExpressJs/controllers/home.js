const config = require('../config/config');
const Expense = require('../models/Expense');

module.exports = {
    get: {
        home: (req, res, next) => {
            res.render('homePage');
        }
    }
};