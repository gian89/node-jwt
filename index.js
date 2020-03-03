"use strict";
// require di Moduli Node
const  express  =  require('express');
const  bodyParser  =  require('body-parser');
const  app  =  express();
const  router  =  express.Router();

//require di moduli Custom
const db = require('./MODULES/DATABASE/database');
const {verifyUser, jwt, newAccesToken} = require('./MODULES/JWT_AUTH/jwt-auth');
const {port} = require('./config');
const mongoDb = require('./MODULES/MONGO_DB/mongoDb.js');


const cors = require('cors');

app.use(cors());

/*
mi connetto al database Mongo in modo da controllare se ci sono problemi
*/
mongoDb.connect()
    .then(db => {
        db.close();
        console.log("Connessione riuscita: ")
    })
    .catch(reason => {
        console.error('errore connessione:', reason);
    });



router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());

app.use(router);


/*
Il server è in ascolto sulla porta definita nella variabile "port"
*/
app.listen(port, () => {
    console.log('Server listening at http://localhost:'  +  port);
});

/*
In questo modo una parte del routing viene gestita da un modulo custom e non nell'index'
*/
app.use(require('./MODULES/ROUTING/trackArrePortalRouting'));
app.use(require('./MODULES/ROUTING/jwtRouting'));

/*
Gestione del routing fatta direttamente nell'index
*/
router.get('/', (req, res) => {
    res.status(200).send('This is an authentication server');
});
router.post('/testUser', async (req, res) => {
    /*    try{
            let utenti = await db.showUsers();
            res.status(200).send({ "user":  utenti});
        }catch (e) {
            res.status(400).send({ "errore":  e});
        }*/
    db.showUsers()
        .then((data)=>{
            console.log('utenti OUT: ' + data);
            res.status(200).send({ "user":  data});
        }).catch((e)=>{
        res.status(400).send({ "errore":  e});
    })

});

