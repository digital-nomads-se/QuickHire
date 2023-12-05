const kafka = require('kafka-node');
const kafkaProducer = require('../kafka/producer');
const kafkaConsumer = require('../kafka/consumer');
const parseResume = require('./parseResume');

async function processApplication(user, job, resume_path) {
    try {
        const filePath = "/home/chaitanya/project-final/QuickHire/public/uploads/cv2.pdf";
        const resumeContent = await parseResume(filePath);
        const email_address = "cgawande12@gmail.com";
        const job_description = "Required Experience: Minimum of Bachelors Degree or its equivalent in Computer Science, Computer Information Systems, Information Technology and Management, Electrical Engineering or a related field. Have experience working and strong understanding of object-oriented programing and cloud technologies.End to end experience delivering production ready code with Java8, Spring Boot, Spring Data, and API librariesStrong experience with unit and integration testing of the Spring Boot APIs.Strong understanding and production experience of RESTful API's and microservice architecture.Strong understanding of SQL databases and NoSQL databases and experience with writing abstraction layers to communicate with the databases."
        
        const messageObject = {
            email_address: email_address,
            job_description: job_description,
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
