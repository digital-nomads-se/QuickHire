const kafka = require('kafka-node');
const kafkaProducer = require('../kafka/producer');
const kafkaConsumer = require('../kafka/consumer');

async function processApplication(email, job_id, resumeContent) {
    try {
        const messageObject = {
            email_address: email,
            job_id: job_id,
            resumeContent: resumeContent
        };
        
        const messageString = JSON.stringify(messageObject);

        kafkaProducer.publishMessage(messageString);
        kafkaConsumer.startConsumer();
        console.log("Data processed successfully");
    } catch (error) {
        console.error('Error processing data:', error);
    }
 }

module.exports = { processApplication };
