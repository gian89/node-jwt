/*
/!*
// Retrieve
const mongo  = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

console.log('Inizio Mongo Db file');

let mongodb = () => {
    return new Promise((resolve, reject) => {
        mongo.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },(err, client) => {
            if (err) {
                console.error(err);
                reject(err)
            }
            // console.log('client:', client);
            resolve(client);
        } )
    })
};
// Connect to the db
clientJwtDb = mongodb()
    .then(value => {
        value.db('jwtUsers');
        console.log('connessione riuscita verso: ', value);
        return value;
})
    .catch(reason => {
    console.log('error di connessione:', reason);
});
*!/

// const jwtDb = clientJwtDb.db('jwtUser');
// Connect to the db
// MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
//     if(err) { return console.dir(err); }
//     console.log('Connessione con mongo Db effettuata');
//
//     db.createCollection('testJwt', {strict:true}, function(err, collection) {});
//
// });
//
// module.exports = jwtDb;
*/

const {MongoClient} = require('mongodb');
const uri ='mongodb://localhost:27017/';
const client = new MongoClient(uri);

async function main(){

    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        // Make the appropriate DB calls
        await client.db("testJwt").createCollection('jwtUsers');
        // await  listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        console.log('CLOSEEEEEEEEEEEEEEEEEEEEEEEEE');
        await client.close();
    }

}

async function listDatabases(client){
    let databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

const createUser = async (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            // Make the appropriate DB calls
            let doc = await client.db("testJwt").collection('jwtUsers').find({}).toArray(); //.collection('jwtUsers').insertOne(user);
            // await  listDatabases(client);
            resolve(doc);
        } catch (e) {
            console.error(e);
            reject(e);
        } /*finally {
            console.log('CLOSEEEEEEEEEEEEEEEEEEEEEEEEE');
            await client.close();
        }*/
    })

};

module.exports = {
    client,
    main,
    createUser
};
