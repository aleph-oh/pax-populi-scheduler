const mongo = require('mongodb');
const config = require('../../javascripts/config.js'); //databaseAddress can now be found at config.databaseAddress()const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const url = config.databaseAddress();

function userDelete(input) {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {

        const db = client.db("paxpopulidb");
        db.collections("users").remove({_id: input});
        db.collections("registrations").remove({_id: input});
        db.collections('schedules').remove({_id: input})



    });
    alert('loaded')
}

userDelete(formattedID);

module.exports = userDelete();