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
import validateToken from '@/middleware/tokenValidation';
import Job from '@/models/Job';
import User from '@/models/User';
import Joi from 'joi';


const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    user: Joi.required(),
    email: Joi.string().email().required(),
    company: Joi.string().required(),
    job_category: Joi.string().required(),
    job_type: Joi.string().required(),
    job_experience: Joi.string().required(),
    job_vacancy: Joi.number().required(),
    job_deadline: Joi.date().required(),
    salary: Joi.number().required(),
});


export default async (req, res) => {
    await ConnectDB();
    const { method } = req;
    switch (method) {
        case 'POST':
            await postAJob(req, res);
            break;
        default:
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}

const postAJob =  async (req, res) => {
    await ConnectDB();
    const data = req.body;

    
    console.log('data => ', data);
    const { title,description , salary , company , email , job_category , job_type , job_experience , job_vacancy , job_deadline } = data;
    const user = new User({
        name: 'Sagar Patel',
        email: 'sagarapatel03@gmail.com',
        password: 'Abc@12345'
    });
    console.log('user => ', user);

    const { error } = schema.validate({ user ,title,description , salary , company , email , job_category , job_type , job_experience , job_vacancy , job_deadline });

    if (error) return res.status(401).json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    try {
        const creatingUser =  await Job.create({user , title,description , salary , company , email , job_category , job_type , job_experience , job_vacancy , job_deadline });
        return res.status(200).json({ success: true, message: "Job Posted Successfully !" })
    } catch (error) {
        console.log('Error in posting a job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry login !" })
    }
}

