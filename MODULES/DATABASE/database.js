const  sqlite3  =  require('sqlite3').verbose();

/*
Funzione che si occupa dell'apertura del database
*/
const database = new sqlite3.Database("./my.db",(err, res)=>{
    if(err){
        console.log('Errore Apertura DB')
    }else {
        console.log('Inizializzazione DB')
    }
});

/*
Questa funzione crea la tabella in caso non sia stata ancora creata
*/
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

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        database.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(row)
            }
        });
    });
};

const createUser = (user) => {
    return new Promise((resolve, reject) => {
        database.run('INSERT INTO users (name, email, role,  password) VALUES (?,?,"normalUser",?)', user, (err) => {
            if (err) {
                console.log('Errore IN' + err);
                reject(err);
            } else {
                console.log('Res IN');
                resolve();
            }
        })
    });
};

const showUsers = () => {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM users`, [], (err, data) => {
            if (err) {
                console.log('Errore IN: ' + err);
                reject(err);
            } else {
                console.log('Resolve IN: ' + data);
                resolve(data);
            }
        })
    });
};


/*
Quando questo modulo verrà importato nell'index, automaticamente  la funzione verrà eseguita e
'inizializzerò il database
*/
try {
    createUsersTable()
}catch (e) {
    console.log('errore DB: ' + e)
}


module.exports = {
    createUsersTable,
    createCustomersTable,
    findUserByEmail,
    createUser,
    showUsers
};
