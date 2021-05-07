'use strict';

const fs = require('fs');

const keywordParserServices = require('../services/keywordParser.services');
const db = require('../model/cloudant.model');
const cloudantJS = fs.readFileSync('./scripts/cloudant-AR.json', 'utf8');

describe('isKeyword() keywordParser.services Test', () => {

    beforeEach(() => {
        jest.spyOn(db, 'getKeywordList').mockImplementation(() => {
            const cloudantAR = JSON.parse(cloudantJS);
            return Promise.resolve(cloudantAR.docs);
        });
    });

    it('Search for a keyword that is in the DB', async () => {
        const response = await keywordParserServices.isKeyword('AR', "ECHO", 1);
        expect(response).toBe(true);
    });

    it('Search for an alias that is in the DB', async () => {
        const response = await keywordParserServices.isKeyword('AR', "FUTVOL", 1);
        expect(response).toBe(true);
    });

    it('Search for a keyword with wrong country', async () => {
        const response = await keywordParserServices.isKeyword('CO', "HD", 1);
        expect(response).toBe(false);
    });

    it('Search for a keyword with "active until" expired', async () => {
        const response = await keywordParserServices.isKeyword('CO', "BAD", 1);
        expect(response).toBe(false);
    });

    it('Search for an alias with "goToBot" true', async () => {
        const response = await keywordParserServices.isKeyword('AR', "OSO5", 1);
        expect(response).toBe(false);
    });
});
