const fetch = require("node-fetch");
const {at, trackEntryPoint} = require('../../config');

const getCustomer = () => {
    return new Promise((resolve, reject) => {
        trackCaller('/customers/search?searchCriteria\n' , 'GET')
            .then(value => resolve(value))
            .catch(reason => reject(reason))
    })
};

/*
Funziona generica che si occupa di effettuare le chiamate verso il server di TrackArre
*/
const trackCaller = async (endPoint, method, body = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fetchRes = await fetch(trackEntryPoint + endPoint,
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + at
                    },
                    body: body
                });
            if (fetchRes.status !== 200) {
                reject({"status": fetchRes.status, "err": fetchRes.statusText});
            }
            let resJson = await fetchRes.json();
            console.log(fetchRes.status);
            resolve({"status": fetchRes.status, "data": resJson});
        }catch (e) {
            reject({"status": 500, "err": e});
        }
    });
};

module.exports = {
    trackArreApi: {
        getCustomer
    }
};
