const express = require('express');
const router = express.Router();

router.use('/health', require('./health.routes'));
router.use('/keyword-parser', require('./keywordParser.routes'));

router.get('/', (request, response) => {
    response.send('Keyword parser OK');
});

router.all('*', (request, response) => {
    response.sendStatus(404);
});

module.exports = router;
