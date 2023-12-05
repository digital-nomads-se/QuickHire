const pdfParse = require('pdf-parse');
const fs = require('fs');

async function parseResume(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
}

module.exports = parseResume;
