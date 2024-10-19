const redis = require('redis');
const redisConfiig = require('./config/redis');

// connect to redis
const redisClient = redis.createClient(redisConfiig);
(async () => {
  await redisClient.connect();
})();
redisClient.on('connect', () => console.log('::> Redis Client Connected'));
redisClient.on('end', () => console.log('::> Redis Client end'));
redisClient.on('error', (err) => console.log(`<:: Redis Client Error ${err}`));
process.on('exit', async () => {
  await redisClient.quit();
});

module.exports = redisClient;
