const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

/*
Questa funzione restituisce una Promise che sarà risolta se la connessione al Database è stata effettuata correttamente
*/
function connect() {
    return new Promise((resolve, reject) =>{
        MongoClient.connect(url, function(err, db) {
            if (err) reject(err);
            db.db("testJwt").createCollection("jwtUsers", function (e, res) {
                if (e) reject(e);
                console.log("Collection created!");
                resolve(db);
            });
        });
    })
}

function closeDb(db) {
    db.close();
}

function insert(user){
    return new Promise((resolve, reject) =>{
        connect()
            .then(db => {
                db.db("testJwt").collection("jwtUsers").insertOne(user, function(err, res) {
                    if (err) {
                        console.log("entro in errore insert");
                        reject(err)
                    }
                    console.log("1 document inserted");
                    db.close();
                    resolve(res);
                });
            })
    })
}

function findUsersByEmail(email){
    return new Promise((resolve, reject) =>{
        connect()
            .then(db => {
                let test = "1";
                let query = { email: { $regex: test } };
                db.db("testJwt").collection("jwtUsers").find(query).toArray(function(err, result) {
                    if (err) {reject(err)}
                    console.log("result: ", result);
                    db.close();
                    resolve(result);
                })
            })
    })
}

function findUserByEmail(email){
    return new Promise((resolve, reject) =>{
        connect()
            .then(async db => {
                let query = { email: email };
                db.db("testJwt").collection("jwtUsers").findOne(query, (function(err, result) {
                    if (err) {reject(err)}
                    console.log("result: ", result);
                    db.close();
                    resolve(result);
                }))
            })
    })
}

function updateUserPassword(email, password) {
    return new Promise((resolve, reject) =>{
        connect()
            .then(async db => {
                let query = { email: email };
                let newValues = { $set: {password: password} };
                db.db("testJwt").collection("jwtUsers").updateOne(query, newValues, (function(err, result) {
                    if (err) {reject(err)}
                    // console.log("result update: ", result);
                    db.close();
                    resolve(result);
                }))
            })
    })
}



module.exports = {
    connect,insert,findUserByEmail,updateUserPassword, findUsersByEmail
};


