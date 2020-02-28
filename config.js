const secretKey = "secretkey23456";

// const expireTime = 24  *  60  *  60;
 const expireTime = 30;
 const refreshExpireTime = 24 * 60 * 60 * 24;

const  port  =  process.env.PORT  ||  3000;

const at = '5w3o7g0jl8vg3ypda7or8aq87x5cgi7p';

const trackEntryPoint = 'http://portaledev-arre.greenvulcano.com/index.php/rest/all/V1';


module.exports = {
    secretKey,
    expireTime,
    refreshExpireTime,
    port,
    at,
    trackEntryPoint
};
