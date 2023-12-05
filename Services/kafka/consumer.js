const kafka = require('kafka-node');
const consumerProcessing = require('../processApplyForJobTask/processConsumedMessage');

function startConsumer() {
    const client = new kafka.KafkaClient({
        kafkaHost: 'pkc-4r087.us-west2.gcp.confluent.cloud:9092',
        sslOptions: {
            rejectUnauthorized: false
        },
        sasl: {
            mechanism: 'plain',
            username: 'FTNK5ESZ5GMNZYM2',
            password: 'z+RfoHQjCRBWwmTPDJaGHSfo+HPuQqWw33PRm2Mb0avCkSCiK988HHmB4w8xS5tz'
        }
    });

    const consumer = new kafka.Consumer(
        client,
        [{ topic: 'job_description'}],
        {
            autoCommit: true
        }
    );

    consumer.on('message', function (message) {
        try {
            const parsedMessage = JSON.parse(message.value);
            consumerProcessing.processConsumedMessage(parsedMessage);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    consumer.on('error', function (err) {
        console.error('Error in Kafka consumer:', err);
    });
}

module.exports = { startConsumer };
