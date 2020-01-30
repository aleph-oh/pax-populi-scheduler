const mongo = require('mongodb');
const config = require('../../javascripts/config.js'); //databaseAddress can now be found at config.databaseAddress()const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const url = config.databaseAddress();

function userDelete(username) {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {

        const query = { username: username};
        const db = client.db("paxpopulidb");

        db.collection("registrations")


    }
}