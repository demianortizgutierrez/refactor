const CloudantModel = require('cloudant');
const logger = require('winston');
const CronJob = require('cron').CronJob;

let connection;
let listKeywords = null;
let cronExp = (process.env.AMBIENTE !== 'prod') ? '0 */1 * * * *' : '0 */5 * * * *';

const connect = async () => {
    return new Promise((resolve, reject) => {
        if (connection) {
            resolve(connection);
        }

        let newCloudant = new CloudantModel({
            url: process.env.CLOUDANT_CONNECTIONSTRING,
            plugin: 'promises'
        }, ((err, client) => {
            if (err) {
                logger.error('connect error: ' + err);
                reject(err);
            } else {
                connection = client;
                resolve(connection);
            }
        }));

        logger.info(`New Cloudant Response: ${JSON.stringify(newCloudant)}`);
    });
};

exports.getKeywordList = async () => {
    if (listKeywords === null) {
        logger.info("getKeywordList: keyword list was empty");
        listKeywords = await getKeywordsStored(process.env.KEYWORDS_DATABASE_NAME);
    }

    return listKeywords;
};

const getKeywordsStored = async (dbName) => {
    connect().then((client) => {
        let db = client.db.use(dbName);

        db.find({selector: {}, fields: ["keyword", "aliases", "action", "country", "ifAloneGoToBot", "ActiveUntil"]})
            .then((body) => {
                return body ? body.docs : null;
            }).catch((err) => {
                logger.error(`getKeywordsStored find error ${err}`);
                return null;
            });
    }).catch((err) => {
        logger.error(`getKeywordsStored connect error ${err}`);
    });
};

const deleteKeywordList = async () => {
    listKeywords = null;
    logger.info('keyword list deleted');
};

const keywordsRefreshTimeJob = new CronJob(
    cronExp,
    deleteKeywordList, null, true, null);

keywordsRefreshTimeJob.start();
