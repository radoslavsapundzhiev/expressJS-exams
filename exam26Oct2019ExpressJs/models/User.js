const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const Model = mongoose.model;

const saltRounds = 10;

const userSchema = new Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        validate: {
            validator: function(v){
                return /[A-Za-z0-9]{4,}/.test(v);
            },
            message: props => 'Username should be at least 4 characters long and should consist only english letters and digits!'
        },
        required: [true, 'Username is required!'],
        unique: [true, 'Username is already taken!']    
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: [true, 'Password is required!'],
        minlength: [8, 'The password should be at least 8 characters long!']
    },
    amount: {
        type: mongoose.SchemaTypes.Number,
        validate: {
            validator: function(v){
                return v > 0;
            },
            message:  'Account should be positive number!'
        },
        required: [true, 'Amount is required!'],
        default: 0
    },
    expenses: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Expense'
        }
    ]
});

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
};

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) { next(err); return; }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) { next(err); return; }
                this.password = hash;
                next();
            });
        });
        return;
    }
    next();
});

module.exports = new Model('User', userSchema);