/**
 * @openapi
 * /api/getAllApplicationsOfSpecifiedJob:
 *   get:
 *     summary: Get all applications of a specified job
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Applications fetched successfully
 *       '400':
 *         description: Invalid request or not logged in
 *       '403':
 *         description: Something went wrong, please retry login
 * securitySchemes:
 *   BearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */

import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import AppliedJob from '@/models/ApplyJob';
import logger from '@/Utils/logger';

export default async (req, res) => {
    await ConnectDB();
    const { method } = req;
    switch (method) {
        case 'GET':
            await validateToken(req, res, async () => {
                await getAllApplicationsOfSpecifiedJob(req, res);
            });
            break;
        default:
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}

const getAllApplicationsOfSpecifiedJob = async (req, res) => {
    await ConnectDB();
    const data = req.query;
    const id = data?.id
    if (!id) return res.status(400).json({ success: false, message: "Please Login" })
    try {
        const gettingjobs = await AppliedJob.find({ job: id }).populate('user');
        logger.info('All applications of a specified job fetched successfully', gettingjobs);
        return res.status(200).json({ success: true, data: gettingjobs })
    } catch (error) {
        console.log('Error in getting a specifed Job job (server) => ', error);
        logger.error('Error in getting a specifed Job job (server) => ', error);
        return res.status(403).json({ success: false, message: "Something Went Wrong Please Retry login  !" })
    }
}