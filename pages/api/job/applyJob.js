/**
 * @openapi
 * /api/applyJob:
 *   post:
 *     summary: Apply for a job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               about:
 *                 type: string
 *               job:
 *                 type: string
 *               user:
 *                 type: string
 *               cv:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Job application submitted successfully
 *       '401':
 *         description: Unauthorized, invalid input
 *       '500':
 *         description: Something went wrong, please retry
 */

import ConnectDB from '@/DB/connectDB';
import Joi from 'joi';
import AppliedJob from '@/models/ApplyJob';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path'
import crypto from 'crypto';
import validateToken from '@/middleware/tokenValidation';
import logger from '@/Utils/logger';

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    about: Joi.string().required(),
    job: Joi.string().required(),
    user: Joi.string().required(),
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res) => {
    await ConnectDB();
    const { method } = req;
    switch (method) {
        case 'POST':
            await validateToken(req, res, async () => {
                await applyToJob(req, res);
            });
            break;
        default:
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}

const applyToJob = async (req, res) => {
    await ConnectDB();
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error', err)
                throw err
            }
            const oldPath = files.cv.filepath;
            const originalFileName = files.cv.originalFilename
            const fileExtension = path.extname(originalFileName);
            const randomString = crypto.randomBytes(6).toString('hex');
            const fileName = `${originalFileName.replace(fileExtension, '')}_${randomString}${fileExtension}`;
            const newPath = path.join(process.cwd(), 'public', 'uploads', fileName);

            // Read the file
            fs.readFile(oldPath, function (err, data) {
                if (err) throw err;
                fs.writeFile(newPath, data, function (err) {
                    if (err) throw err;
                });
                fs.unlink(oldPath, function (err) {
                    if (err) throw err;
                });
            });

            const jobApplication = {
                name: fields.name,
                email: fields.email,
                about: fields.about,
                job: fields.job,
                user: fields.user,
                cv: fileName,
            };

            const { name, email, about, job, user } = jobApplication;
            const { error } = schema.validate({ name, email, about, job, user });
            if (error) return res.status(401).json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

            const newJobApplication = AppliedJob.create(jobApplication);
            logger.info('New job application created', newJobApplication);
            return res.status(200).json({ success: true, message: 'Job application submitted successfully !' });
        })
    } catch (error) {
        console.log('error in apply job (server) => ', error);
        logger.error(`error in apply job (server) => ${error}`);
        return res.status(500).json({ success: false, message: 'something went wrong please retry login !' });
    }
}