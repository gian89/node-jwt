const router = require('./configRouting');
/*
Questa modulo serve per criptare e decriptare le password
*/
const  bcrypt  =  require('bcryptjs');


/*
require di moduli Custom
*/
const db = require('../DATABASE/database');
const {verifyUser, jwt ,newAccesToken} = require('../JWT_AUTH/jwt-auth');
const {expireTime,refreshExpireTime,secretKey} = require('../../config');
const mongoDb = require('../MONGO_DB/mongoDb');

/*
Queste funzioni si occupano di gestire la registrazione e la login degli utenti.
Al momento della registrazione la password viene salvata in modo criptato.
Le funzioni sono implementata sia per un database MySql che per un Mongo.
Al momento delle login agli utenti viene assegnato un token che servirà a verificare la propria identita nelle successive chiamate.
*/

router.post('/registerMongo', async (req, res) => {
    let user = {
        "name": req.body.name,
        "email": req.body.email,
        "password":  bcrypt.hashSync(req.body.password),
        "role": "normalUser"
    };
    await mongoDb.insert(user)
        .then(() => {
            console.log("tipo", res);
            return res.status(200).send("Utente creato correttamente! ");
        }).catch((err) => {
        console.log('createUser Error: ' + err);
        return  res.status(500).send("Server db error!" + JSON.stringify(err) );
    });
});

router.post('/loginMongo', (req, res) => {
    const  email  =  req.body.email;
    const  password  =  req.body.password;
    mongoDb.findUserByEmail(email)
        .then((user) => {
            if (!user) {
                return res.status(404).send('User not found! ');
            }
            const  result  =  bcrypt.compareSync(password, user.password);
            if(!result) return  res.status(401).send('Password not valid!');
            // const  expiresIn  =  24  *  60  *  60;
            const  accessToken  =  jwt.sign({ _id: user._id, role: user.role, email: user.email }, secretKey, {
                expiresIn:  expireTime
            });
            const  refreshToken  =  jwt.sign({ _id: user._id, role: user.role, email: user.email }, secretKey, {
                expiresIn:  refreshExpireTime
            });
            res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expireTime, "refresh_token": refreshToken });
        }).catch((err) => {
        return res.status(500).send('Server error! ' + err);
    });
});

router.post('/searchUsersByEmailMongo', (req, res) => {
    const  email  =  req.body.email;
    mongoDb.findUsersByEmail(email)
        .then((user) => {

            res.status(200).send({ "user":  user});
        }).catch((err) => {
        return res.status(500).send('Server error! ' + err);
    });
});

router.post('/updateUserPasswordMongo', async (req, res) => {
    const  email  =  req.body.email;
    const  password  =  req.body.password;
    const  newPassword =  bcrypt.hashSync(req.body.newPassword);
    const  accesToken  =  req.body.accesToken;
    mongoDb.findUserByEmail(email)
        .then((user) => {
            if (!user) {
                return res.status(404).send('User not found! ');
            }
            const  result  =  bcrypt.compareSync(password, user.password);
            if(!result) return  res.status(401).send('Password not valid!');
            // const  expiresIn  =  24  *  60  *  60;
            const verifyAcces = verifyUser(accesToken);
            if (verifyAcces){
                // res.status(200).send({ "accesToken":  "valid", "role": verifyAcces.role});
                mongoDb.updateUserPassword(email, newPassword)
                    .then(value => {
                        res.status(200).send("Password Updated");
                    })
                    .catch(reason => {
                        return res.status(500).send('Server error! ' + reason);
                    })
            }else{
                return res.status(401).send({ "accesToken":  "not valid"});
            }
        }).catch((err) => {
        return res.status(500).send('Server error! ' + err);
    });
});

router.post('/testAccesToken', (req, res) => {
    console.log('inizio');
    const  accesToken  =  req.body.accesToken;
    verifyUser(accesToken)
        .then(verifyAcces => {
            res.status(200).send({
                "_id": verifyAcces._id,
                "accesToken": "valid",
                "role": verifyAcces.role,
                "email": verifyAcces.email
            });
        })
        .catch(reason => {
            console.log(reason);
            res.status(reason.number).send({"accesToken": reason.message});
        });
});

router.post('/newAccesToken', (req, res) => {
    console.log('inizio refresh token');
    const  refreshToken  =  req.body.refreshToken;
    newAccesToken(refreshToken)
        .then(value => {
            res.status(200).send({ "accesToken": value});
        })
        .catch(reason => {
            res.status(401).send({ "accesToken":  "not valid"});
        })
});

/*
Funzioni di autenticazione con db basato su mySql
*/

router.post('/register', (req, res) => {
    const  email  =  req.body.email;
    const  name  =  req.body.name;
    const  password  =  bcrypt.hashSync(req.body.password);
    const userData = [name, email, password];
    db.createUser(userData)
        .then(() => {
            return  res.status(200).send("Utente creato correttamente! ");
        }).catch((err) => {
        console.log('createUser Error: ' + err.code);
        if (err.code === 'SQLITE_CONSTRAINT'){
            return  res.status(500).send("Email già esistente!");
        }
        return  res.status(500).send("Server db error!" + JSON.stringify(err) );
    });
});

router.post('/login', (req, res) => {
    const  email  =  req.body.email;
    const  password  =  req.body.password;
    db.findUserByEmail(email)
        .then((user) => {
            if (!user) {
                return res.status(404).send('User not found! ');
            }
            const  result  =  bcrypt.compareSync(password, user.password);
            if(!result) return  res.status(401).send('Password not valid!');
            // const  expiresIn  =  24  *  60  *  60;
            const  accessToken  =  jwt.sign({ id:  user.id, role: user.role }, secretKey, {
                expiresIn:  expireTime
            });
            res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expireTime});
        }).catch((err) => {
        return res.status(500).send('Server error! ' + err);
    });
});

module.exports = router;
