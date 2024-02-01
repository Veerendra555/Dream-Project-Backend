var dotenv = require('dotenv').config();

module.exports.liveData = false;
module.exports.mongoDbUrl  = process.env.MONGO_LIVE_URL 