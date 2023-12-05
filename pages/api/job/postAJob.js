/**
 * @openapi
 * /api/postAJob:
 *   post:
 *     summary: Post a job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: 
 *                 type: string
 *               description: 
 *                 type: string
 *               user: 
 *                 type: string
 *               email: 
 *                 type: string
 *               company: 
 *                 type: string
 *               job_category: 
 *                 type: string
 *               job_type: 
 *                 type: string
 *               job_experience: 
 *                 type: string
 *               job_vacancy: 
 *                 type: integer
 *               job_deadline: 
 *                 type: string
 *                 format: date-time
 *               salary: 
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Job posted successfully
 *       '400':
 *         description: Invalid request or not logged in
 *       '500':
 *         description: Something went wrong, please retry login
 */

import ConnectDB from '@/DB/connectDB';
import Job from '@/models/Job';
import Joi from 'joi';
import logger from '@/Utils/logger';
import { httpRequestCount } from '../metrics';
import { getSession } from '@auth0/nextjs-auth0';

const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    email: Joi.string().email().required(),
    company: Joi.string().required(),
    job_category: Joi.string().required(),
    job_type: Joi.string().required(),
    job_experience: Joi.string().required(),
    job_vacancy: Joi.number().required(),
    job_deadline: Joi.date().required(),
    salary: Joi.number().required(),
    userEmail: Joi.string().email().required(),
});

export default async (req, res) => {
    await ConnectDB();
    const { method } = req;

    switch (method) {
        case 'POST':
            httpRequestCount.inc({ method: req.method, route: req.url, statusCode: res.statusCode });
            await postAJob(req, res);
            break;
        default:
            httpRequestCount.inc({ method: req.method, route: req.url, statusCode: 400 });
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}

const postAJob = async (req, res) => {
    await ConnectDB();
    const data = req.body;

    const session = await getSession(req, res);
    
    if (!session || !session.user) {
        res.status(400).json({ success: false, message: 'Unauthorized' });
        return;
    }

    const userEmail = session.user.email;
    
    const { title, description, salary, company, email, job_category, job_type, job_experience, job_vacancy, job_deadline } = data;
    const { error } = schema.validate({ userEmail, title, description, salary, company, email, job_category, job_type, job_experience, job_vacancy, job_deadline });
    if (error) return res.status(401).json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });
    try {
        const creatingUser = await Job.create({ userEmail, title, description, salary, company, email, job_category, job_type, job_experience, job_vacancy, job_deadline });
        logger.info('Job Posted Successfully !', creatingUser);
        return res.status(200).json({ success: true, message: "Job Posted Successfully !" })
    } catch (error) {
        console.log('Error in posting a job (server) => ', error);
        logger.error('Error in posting a job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry login !" })
    }
}

