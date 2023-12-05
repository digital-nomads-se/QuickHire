const jobengine = require('../processApplyForJobTask/jobEngine');
const redisConn = require('../redis/redisFunctions');

async function processConsumedMessage(job_description, resumeContent) {
    const percentage = jobengine.calculateMatchPercentage(job_description, resumeContent);
    console.log('Match Percentage:', percentage);
    pushKeyValueToRedis(percentage);

}

async function pushKeyValueToRedis(percentage) {
    const jobId = "123";
    const userId = "123";
    const redisKey = redisConn.createRedisKey(jobId, userId);
    redisConn.setKey(redisKey, percentage);
    const redisValue = redisConn.getKey(redisKey);
    redisValue.then((value) => {
        console.log('redisValue:', value);
    }).catch((error) => {
        console.error('Error in redisValue:', error);
    });
}

module.exports = { processConsumedMessage };
