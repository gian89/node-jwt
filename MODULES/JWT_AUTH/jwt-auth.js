const  jwt  =  require('jsonwebtoken');
const {secretKey,expireTime} = require('../../config');


const verifyUser = (accesToken) => {
    try{
        console.log("inizio verifica token");
        const payload = jwt.verify(accesToken, secretKey);
        console.log('payload:', payload);
        return payload;
    } catch(error) {
        if (error instanceof jwt.JsonWebTokenError){
            console.log("jwt expired");
        }
        console.log('errore token', error);
        return false;
    }
};

/*
const  accessToken  =  jwt.sign({ _id: user._id, role: user.role, email: user.email }, secretKey, {
    expiresIn:  expireTime
});
*/

const newAccesToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        try{
            console.log("inizio verifica token");
            const payload = jwt.verify(refreshToken, secretKey);
            console.log('payload:', payload);
            const  accessToken  =  jwt.sign({ _id: payload._id, role: payload.role, email: payload.email }, secretKey, {
                expiresIn:  expireTime
            });
            resolve(accessToken);
        } catch(error) {
            if (error instanceof jwt.JsonWebTokenError){
                console.log("jwt expired");
            }
            console.log('errore token', error);
            reject(false);
        }
    })

};

module.exports = {
    jwt,
    verifyUser,
    newAccesToken
};
