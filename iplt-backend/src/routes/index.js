const router = require('express').Router();

const { buyTokens, getPacks, createPack } = require('./controller');

router.put('/buyPack', buyTokens);

router.get('/packs', getPacks);

router.post('/createPack', createPack);

router.get('/ping', (req, res) => res.status(200).send('pong'));

module.exports = router;
