/**
 * @openapi
 * /api/getAppliedJobs:
 *   get:
 *     summary: Get all jobs applied by a specific user
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Applied jobs fetched successfully
 *       '400':
 *         description: Invalid request or not logged in
 *       '500':
 *         description: Something went wrong, please retry login
 */

import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import ApplyJob from '@/models/ApplyJob';
import logger from '@/Utils/logger';
import { httpRequestCount } from '../metrics';

export default async (req, res) => {
    await ConnectDB();
    const { method } = req;
    switch (method) {
        case 'GET':
            await validateToken(req, res, async () => {
                httpRequestCount.inc({ method: req.method, route: req.url, statusCode: res.statusCode });
                await getAppliedJobs(req, res);
            });
            break;
        default:
            httpRequestCount.inc({ method: req.method, route: req.url, statusCode: 400 });
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}

const getAppliedJobs = async (req, res) => {
    await ConnectDB();
    const userId = req.query.id;
    if (!userId) return res.status(400).json({ success: false, message: "Please Login" })
    try {
        const gettingAppliedJobs = await ApplyJob.find({ user: userId }).populate('user').populate('job');
        logger.info('All applied jobs fetched successfully for userId : ', userId);
        return res.status(200).json({ success: true, data: gettingAppliedJobs })
    } catch (error) {
        console.log('Error in getting applied  job (server) => ', error);
        logger.error('Error in getting applied job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry login !" })
    }
}