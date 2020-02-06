const  jwt  =  require('jsonwebtoken');
const {secretKey} = require('../../config');


const verifyUser = (accesToken) => {
    try{
        const payload = jwt.verify(accesToken, secretKey);
        console.log(payload);
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
