const mongoose = require('mongoose');
const config = require('./config');
const dbName = 'expenses'; //TODO: Put the DB NAME!

module.exports = () => {
    return mongoose.
        connect(
            config.dbURL + dbName,
            { useNewUrlParser: true, useUnifiedTopology: true },
            console.log('DB IS READY!')
        );
};