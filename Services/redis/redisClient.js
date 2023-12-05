const redis = require('redis');

const client = redis.createClient({
    url: 'redis://default:cc600200@redis-11790.c274.us-east-1-3.ec2.cloud.redislabs.com:11790', // Use your Redis instance's connection string
  });

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

module.exports = client;