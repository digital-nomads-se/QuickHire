const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URI,
  });

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

module.exports = client;