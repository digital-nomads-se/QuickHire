const kafka = require('kafka-node');
const consumerProcessing = require('../processApplyForJobTask/processConsumedMessage');

function startConsumer() {
    const client = new kafka.KafkaClient({
        kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
        sslOptions: {
            rejectUnauthorized: false
        },
        sasl: {
            mechanism: 'plain',
            username: process.env.KAFKA_USERNAME,
            password: process.env.KAFKA_PASSWORD
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
