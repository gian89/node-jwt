"use strict";
const  express  =  require('express');
const  bodyParser  =  require('body-parser');

const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs');

const  app  =  express();
const  router  =  express.Router();

const  sqlite3  =  require('sqlite3').verbose();
const database = new sqlite3.Database("./my.db");

const fetch = require("node-fetch");


const db = require('./MODULES/DATABASE/database');


const SECRET_KEY = "secretkey23456";


const createUsersTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS users (
        id integer PRIMARY KEY,
        name text,
        email text UNIQUE,
        role text,
        password text)`;

    return database.run(sqlQuery);
};

const createCustomersTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS customers (
        id integer PRIMARY KEY,
        name text,
        email text UNIQUE,
        role text,
        password text)`;

    return database.run(sqlQuery);
};

const findUserByEmail = (email, cb) => {
    return database.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        cb(err, row)
    });
};

const verifyUser = (accesToken) => {
    try{
        const payload = jwt.verify(accesToken, SECRET_KEY);
        console.log(payload);
        return payload;
    } catch(error) {
        console.log('errore token');
        return false;
    }
};

const createUser = (user, cb) => {
    return database.run('INSERT INTO users (name, email, role,  password) VALUES (?,?,"normalUser",?)', user, (err) => {
        cb(err)
    });
};

const showUsers = () => {
    return database.all(`SELECT * FROM users`, [], (err, row) => {
        if (err) {
            console.log('Errore: ' + err);
        } else {
            console.log('Utenti: ' + JSON.stringify(row));
            return row;
        }
    });
};

createUsersTable();



router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());


router.post('/register', (req, res) => {


    const  email  =  req.body.email;
    const  name  =  req.body.name;
    const  password  =  bcrypt.hashSync(req.body.password);

    createUser([name, email, password], (err)=>{
        if(err) return  res.status(500).send("Server error!");
        findUserByEmail(email, (err, user)=>{
            if (err) return  res.status(500).send('Server error!');
            const  expiresIn  =  24  *  60  *  60;
            const  accessToken  =  jwt.sign({ id:  user.id, role: user.role }, SECRET_KEY, {
                expiresIn:  expiresIn
            });
            res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn
            });
        });
    });
});

router.post('/login', (req, res) => {
    const  email  =  req.body.email;
    const  password  =  req.body.password;
    findUserByEmail(email, (err, user)=>{
        if (err) return  res.status(500).send('Server error!');
        if (!user) return  res.status(404).send('User not found!');
        const  result  =  bcrypt.compareSync(password, user.password);
        if(!result) return  res.status(401).send('Password not valid!');

        const  expiresIn  =  24  *  60  *  60;
        const  accessToken  =  jwt.sign({ id:  user.id, role: user.role }, SECRET_KEY, {
            expiresIn:  expiresIn
        });
        res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn});
    });
});

router.post('/test', (req, res) => {
    const  accesToken  =  req.body.accesToken;
    const verifyAcces = verifyUser(accesToken);
    if (verifyAcces){
        res.status(200).send({ "accesToken":  "valid", "role": verifyAcces.role});
    }else{
        res.status(401).send({ "accesToken":  "not valid"});
    }
});

router.post('/testCustomer', (req, res) => {
    let at = '5w3o7g0jl8vg3ypda7or8aq87x5cgi7p';
    fetch('http://portaledev-arre.greenvulcano.com/index.php/rest/all/V1/customers/search?searchCriteria\n', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        }
    })
        .then(res => res.json())
        .then((json) => {
            console.log(json);
            res.status(200).send({ "accesToken":  "valid", "customerList": json.items});
        });
});

router.post('/testUser', (req, res) => {
    let utenti = showUsers();
    res.status(200).send({ "user":  utenti});
});

app.use(router);
const  port  =  process.env.PORT  ||  3000;
const  server  =  app.listen(port, () => {
    console.log('Server listening at http://localhost:'  +  port);
});
router.get('/', (req, res) => {
    res.status(200).send('This is an authentication server');
});
