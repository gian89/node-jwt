const router = require('./configRouting');
const  bcrypt  =  require('bcryptjs');


//require di moduli Custom
const db = require('../DATABASE/database');
const {verifyUser, jwt} = require('../JWT_AUTH/jwt-auth');
const {expireTime,secretKey} = require('../../config');

const mongoDb = require('../MONGO_DB/mongoDb');


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
            const  accessToken  =  jwt.sign({ id:  user.id, role: user.role }, secretKey, {
                expiresIn:  expireTime
            });
            res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expireTime});
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


module.exports = router;
