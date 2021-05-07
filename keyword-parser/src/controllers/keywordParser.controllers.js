const KeywordParserService = require('../services/keywordParser.services');
const logger = require('winston');

exports.validateKeyword = async (request, response) => {
    logger.info(`Incoming msg : ${JSON.stringify(request.body)}`);

    let country = request.body.pais;
    let message = request.body.payload;
    let cant = message.split(' ').length;
    let msg = message.split(' ')[0];

    logger.info(`# of words : ${cant}`);

    if (cant >= 1 && cant < 4) {
        logger.info('The request have at least 1 string');
        let res = await KeywordParserService.isKeyword(country, msg, cant);

        if (res) {
            logger.info(`Keyword '${msg}' = true`);
            response.status(200).send(JSON.stringify({
                isKeyword: 'true'
            }));
        } else if (res === null) {
            logger.error(`Database Error`);
            response.status(503).send('Service Unavailable');
        } else {
            logger.info(`Keyword '${msg}' = false`);
            response.status(200).send(JSON.stringify({
                isKeyword: 'false'
            }));
        }
    } else {
        logger.error(`Bad quantity of strings`);
        response.status(400).send('The Number of Strings in the payload should be between 1 an 3');
    }
};
