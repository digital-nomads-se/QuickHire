const kafka = require('kafka-node');

// Function to publish a message
function publishMessage(message) {
    const user = new kafka.KafkaClient({
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
