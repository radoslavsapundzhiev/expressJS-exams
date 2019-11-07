const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;


const expenseSchema = new Schema({
    merchant: {
        type: mongoose.SchemaTypes.String,
        required: true,
        minlength: [4, 'The merchant should be at least 4 characters long!']
    },
    date: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: Date.now
    },
    total: {
        type: mongoose.SchemaTypes.Number,
        validate: {
            validator: function(v){
                return v > 0;
            },
            message:  'Total should be positive number!'
        },
        required: true
    },
    category: {
        type: mongoose.SchemaTypes.String,
        enum: ['advertising', 'benefits', 'car', 'equipment', 'fees', 'home-office', 'insurance', 'interest', 'Labor', 'maintenance', 'materials', 'meals-and-entertainment', 'office-supplies', 'other', 'professional-services', 'rent', 'taxes', 'travel', 'utilities'],
        required: true
    },
    description: {
        type: mongoose.SchemaTypes.String,
        required: true,
        minlength: [10, 'The description should be minimum 10 characters long'],
        maxlength: [50, 'The description should be 50 characters maximum']
    },
    report: {
        type: mongoose.SchemaTypes.Boolean,
        required: true,
        default: false
    },
    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }
});


module.exports = new Model('Expense', expenseSchema);