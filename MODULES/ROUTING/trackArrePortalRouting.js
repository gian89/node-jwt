const router = require('./configRouting');

/*
require di moduli Custom
*/
const {trackArreApi} = require('../TRACK_ARRE_API/trackArreApi');

console.log('testRouting');

/*
Alternativa se volessimo mettere tutte le funzioni di routing in un'unica pagina e non nell'index
*/

router.post('/testCustomer', (req, res) => {
    trackArreApi.getCustomer()
        .then(value => {
            res.status(value.status).send({"accesToken": "valid", "customerList": value.data.items});
        })
        .catch(reason => {
            res.status(reason.status).send({"Errore: ": reason.err});
        })
});

module.exports = router;
