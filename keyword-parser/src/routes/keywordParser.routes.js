const express = require('express');
const router = express.Router();

const KeywordParserController = require('../controllers/keywordParser.controllers');

router.post('/', KeywordParserController.validateKeyword);

module.exports = router;
