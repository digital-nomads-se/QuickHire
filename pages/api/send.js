const kafkaProducer = require('../../Services/kafka/producer');
const kafkaConsumer = require('../../Services/kafka/consumer');
const process = require('../../Services/processApplyForJobTask/processJobApplication');

export default async (req, res) => {
    process.processApplication();
    res.status(200).json({ success: true, message: 'valid Request' });
}