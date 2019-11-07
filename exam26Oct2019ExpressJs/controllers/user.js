const { User } = require('../models');
const { Expense } = require('../models');
const jwt = require('../utils/jwt');
const config = require('../config/config');

module.exports = {
    get: {
        login: (req, res, next) => {
            res.render('user/login');
        },

        register: (req, res, next) => {
            res.render('user/register');
        },

        logout: (req, res, next) => {
            res
                .clearCookie(config.cookie)
                .clearCookie('username')
                .redirect('/');
        },
        profile: (req, res, next) => {
            let totalAmount = 0;

            Expense
                .find({ creator: req.user._id })
                .select('total merchant')
                .then((expenses) => {
                    let totalMerchants = expenses
                                                .map(e => e.merchant)
                                                .filter((item, i, arr) => arr.indexOf(item) === i)
                                                .length;
                    totalAmount = expenses.map(e => e.total).reduce((acc, curr) => acc + curr, 0);
                    let availableAccount = req.user.amount - totalAmount;
                    res.render('user/profile', { totalAmount, totalMerchants, availableAccount});
                });
        }
    },

    post: {
        login: (req, res, next) => {
            const { username, password } = req.body;

            User.findOne({ username })
                .then((userData) => Promise.all([userData, userData.matchPassword(password)]))
                .then(([userData, match]) => {
                        if (!match) {
                            res.render('user/login', { message: 'User password is invalid!' });
                            return;
                        }

                        const token = jwt.createToken({ id: userData._id });

                        res
                            .cookie(config.cookie, token)
                            .cookie('username', userData.username)
                            .redirect('/expense/all');

                    })
                    .catch((err)=> {
                        res.render('user/login', { message: 'Username is invalid!' });
                    });
        },

        register: (req, res, next) => {
            const { username, password, amount } = req.body;
            
            //TODO: Add error handling

            const repeatPass = req.body['repeat-password'];

            if(password !== repeatPass){
                res.render('user/register', { errorMessages: ['•	The repeat password should be equal to the password!'], user: req.body});
                return;
            }

            User.create({ username, password, amount })
            .then(() => {
                res
                    .redirect('/user/login');
            })
            .catch((err) => {
                if(err.name === 'MongoError'){
                    res.render('user/register', { errorMessages: ['User already exists!'], user: req.body});
                }else if(err.name === 'ValidationError'){
                    const errorMessages = Object.entries(err.errors).map(tuple => {
                        return tuple[1].message;
                    });
                    res.render('user/register', { errorMessages, user: req.body });
                }
            });
        }
    }
};