/**
 * @openapi
 * /api/getAllJobs:
 *   get:
 *     summary: Get all jobs
 *     responses:
 *       '200':
 *         description: Jobs fetched successfully
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Something went wrong, please retry login
 */

import ConnectDB from '@/DB/connectDB';
import Job from '@/models/Job';
import logger from '@/Utils/logger';

export default async (req, res) => {
    await ConnectDB();
    const { method } = req;
    switch (method) {
        case 'GET':
            await getAllJobs(req, res);
            break;
        default:
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}

const getAllJobs = async (req, res) => {
    await ConnectDB();
    try {
        const gettingjobs = await Job.find({}).populate('user');
        logger.info('All jobs fetched successfully', gettingjobs);
        return res.status(200).json({ success: true, data: gettingjobs })
    } catch (error) {
        console.log('Error in getting a job (server) => ', error);
        logger.error('Error in getting a job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry login  !" })
    }
}