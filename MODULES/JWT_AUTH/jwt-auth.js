const  jwt  =  require('jsonwebtoken');
const {secretKey} = require('../../config');


const verifyUser = (accesToken) => {
    try{
        console.log("inizio verifica token");
        const payload = jwt.verify(accesToken, secretKey);
        return payload;
    } catch(error) {
        console.log('errore token');
        return false;
    }
};

module.exports = {
    jwt,
    verifyUser
};
