const config = require('../config/config');
const Expense = require('../models/Expense');
const User = require('../models/User');


module.exports = {
    get: {
        create: (req, res) => {
            res.render('expense/create');
        },
        report: (req, res) => {

            const { expenseId } = req.params;

            Expense
                .findById(expenseId)
                .then((expense) => {
                    let formatedDate =  expense.date.toLocaleDateString("en-US");
                    res.render('expense/report', { expense, formatedDate });
                });
        },
        delete: (req, res) => {
            const id = req.params.expenseId;
            
            Expense
                .findByIdAndRemove(id)
                .then((removedExpense) => {
                    req.user.expenses = req.user.expenses.filter(e => e.toString() !== removedExpense._id.toString());
                    return User.findByIdAndUpdate({ _id: req.user._id }, req.user);   
                })
                .then(() => {
                    res.redirect('/expense/all');
                })
                .catch(console.error);

        },
        all: (req, res) => {
            Expense
                .find({ creator: req.user._id})
                .then((expenses) => {
                    expenses.forEach(e => e.date = e.date.toLocaleDateString("en-US"));
                    res.render('expense/myExpenses', { expenses });
                });
        }
    },
    post: {
        create: (req, res) => {
            const { merchant, total, category, description, report } = req.body;
            const isChecked = report === 'on';

            Expense
                .create({ merchant, total, category, description, report: isChecked, creator: req.user._id })
                .then((eData) => {
                    req.user.expenses.push(eData._id);
                    return User.findByIdAndUpdate({ _id: req.user._id }, req.user);
                })
                .then((updateUser) => {
                    res.redirect('/expense/all');
                })
                .catch((err) => {
                    if(err.name === 'ValidationError'){
                        const errorMessages = Object.entries(err.errors).map(tuple => {
                            return tuple[1].message;
                        });
                        res.render('expense/create', { errorMessages, expense: { merchant, total, description, isChecked, category} });
                    }
                });
        },
        refill: (req, res) => {
            const { refill } = req.body;
            req.user.amount += +refill;
            User.findByIdAndUpdate({ _id: req.user._id}, req.user)
                .then(() => {
                    res.redirect('/expense/all');
                })
                .catch(console.error);
        }
    }
}
