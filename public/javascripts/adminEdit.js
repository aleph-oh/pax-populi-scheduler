const mongo = require('mongodb');
const config = require('../../javascripts/config.js'); //databaseAddress can now be found at config.databaseAddress()const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const url = config.databaseAddress();
console.log(url);

function userDisplay(username) {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {

        if (err) {
            console.log(err.message);
        }

        const db = client.db("paxpopulidb");
        let query = { username: username };
        db.collection("users").find(query, {projection: {_id: 0, username: 1}}).toArray().then((docs) => {

            console.log(docs);

        }).catch((err) => {

            console.log(err);

        }).finally(() => {

            client.close();
        });

    });
}

/**Changes the values in registrations which are not directly schedule-related.
 * @param username: the username of the user to be changed
 * @param field: the field of the database to edit
 * @param newVal: the new values from the administrator
 */
function userUpdate(username, field, newVal) {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {

        const query = { username: username};
        const toChange = {field: newVal};
        const db = client.db("paxpopulidb");

        db.collection("registrations").updateOne(query, toChange, function(err) {
            if (err) {
                console.log(err.message)
            }
            console.log("1 document changed.")
        });

})}

module.exports = userDisplay();
//module.exports = userUpdate();