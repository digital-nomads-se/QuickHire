/**
 * @openapi
 * /api/getApplicationDetail:
 *   get:
 *     summary: Get details of a specific job application
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Application details fetched successfully
 *       '400':
 *         description: Invalid request or not logged in
 *       '403':
 *         description: Something went wrong, please retry login
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
            await getApplicationDetail(req, res);
            break;
        default:
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}


const getApplicationDetail = async (req, res) => {
    const data = req.query;
    const id = data?.id
    if (!id) return res.status(400).json({ success: false, message: "Please Login" })
    try {
        const getApplicationDetails = await AppliedJob.findById(id).populate('job').populate('user')
        logger.info('Application details fetched successfully', getApplicationDetails);
        return res.status(200).json({ success: true, data: getApplicationDetails })
    } catch (error) {
        console.log('Error in getting a specifed Job job (server) => ', error);
        logger.error('Error in getting a specifed Job job (server) => ', error);
        return res.status(403).json({ success: false, message: "Something Went Wrong Please Retry login  !" })
    }
}