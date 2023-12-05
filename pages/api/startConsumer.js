const kafkaConsumer = require('../../Services/kafka/consumer');

export default async (req, res) => {
    kafkaConsumer.startConsumer();
    res.status(200).json({ success: true, message: 'Start Consumer' });
}