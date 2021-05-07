const db = require('../model/cloudant.model');
const logger = require('winston');

exports.isKeyword = async (country, word, cant) => {

    let docs = await db.getKeywordList();

    if (!docs) {
        return null;
    }

    logger.info(`isKeyword: ${word}`);

    let initialLength = word.length;

    if (initialLength !== 3) {
        word = word.split(/\d+/g)[0];
    }

    if (isNaN(word)) {
        word = word.toUpperCase();
    }

    let isFound = false;

    docs.find(doc => {
        if (country === doc.country) {
            if (word === doc.keyword && new Date(doc.ActiveUntil) > new Date()) {
                logger.info(`${word} is synonymous with keyword`);
                if (doc.ifAloneGoToBot === true && cant === 1 && word.length === initialLength) {
                    logger.info(`${word} can go directly to Chatbot`);
                } else {
                    isFound = true;
                }
            }

            doc.aliases.forEach(alias => {
                if (word === alias && new Date(doc.ActiveUntil) > new Date()) {
                    logger.info(`${word} is synonymous with alias`);
                    if (doc.ifAloneGoToBot === true && cant === 1 && word.split(/\d+/g).length === 1) {
                        logger.info(`${word} can go directly to Chatbot`);
                    } else {
                        isFound = true;
                    }
                }
            });
        }
    });

    return isFound;
};
