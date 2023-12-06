const kafka = require('kafka-node');

// Function to publish a message
function publishMessage(message) {
    console.log("Publishing message to Kafka..." + message);
    const user = new kafka.KafkaClient({
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

    const producer = new kafka.Producer(user);

    producer.on('ready', (error, data) => {
        console.log("Producer is ready, sending message...");
        const payload = [
            {
                topic: 'job_description',
                messages: message
            }
        ];

        producer.send(payload, (error, data) => {
            if (error) {
                console.error('Error in publishing message:', error);
            } else {
                console.log('Message successfully published:', data);
            }
        });
    });

    producer.on('error', (error) => {
        console.error('Error connecting to Kafka:', error);
    });
}

// Export the function
module.exports = { publishMessage };
