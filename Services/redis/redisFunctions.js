const redisClient = require('./redisClient');

async function setKey(key, value) {
  await redisClient.set(key, value);
}

async function getKey(key) {
  return await redisClient.get(key);
}

function createRedisKey(jobId, userId) {
  return `job:${jobId}:user:${userId}:percentage`;
}

module.exports = { setKey, getKey, createRedisKey };
