const  jwt  =  require('jsonwebtoken');
const {secretKey,expireTime} = require('../../config');


const verifyUser = (accesToken) => {
    return new Promise((resolve, reject) => {
        try{
            console.log("inizio verifica token");
            const payload = jwt.verify(accesToken, secretKey);
            console.log('payload:', payload);
            resolve(payload);
        } catch(error) {
            if (error instanceof jwt.TokenExpiredError){
                let expiredTokenResponse = {
                    "number": 400,
                    "message": "expired acces token"
                };
                console.log("jwt expired");
                reject(expiredTokenResponse);
            }else {
                let notValidTokenResponse = {
                    "number": 401,
                    "message": "not valid"
                };
                console.log("not valid token");
                reject(notValidTokenResponse);
            }

        }
    })

};

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
