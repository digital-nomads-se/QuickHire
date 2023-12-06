const jobengine = require('../processApplyForJobTask/jobEngine');
const redisConn = require('../redis/redisFunctions');

async function processConsumedMessage(parsedMessage) {
    const { job_id, email_address, resumeContent } = parsedMessage;
    const job_detailis = await getJobById(job_id);
    console.log('Job Details:', job_detailis);
    const job_description = job_detailis.data.description;
    console.log('Job Description:', job_description);
    const percentage = jobengine.calculateMatchPercentage(job_description, resumeContent);
    console.log('Match Percentage:', percentage);
    pushKeyValueToRedis(job_id, email_address, percentage);
}

async function pushKeyValueToRedis(job_id, email_address, percentage) {
    const redisKey = redisConn.createRedisKey(job_id, email_address);
    redisConn.setKey(redisKey, percentage);
    const redisValue = redisConn.getKey(redisKey);
    redisValue.then((value) => {
        console.log('redisValue:', value);
    }).catch((error) => {
        console.error('Error in redisValue:', error);
    });
}

async function getJobById(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/getSpecifiedJob?id=${id}`, {
            method: 'GET'
        })
        const data = res.json();
        return data;
    } catch (error) {
        console.log('error in getting  specified job (service) => ', error);
    }
}

module.exports = { processConsumedMessage };
