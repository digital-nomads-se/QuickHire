/**
 * @openapi
 * /api/responseOfApplication:
 *   put:
 *     summary: Update the status of a job application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: 
 *                 type: string
 *               id: 
 *                 type: string
 *     responses:
 *       '200':
 *         description: Status updated successfully
 *       '400':
 *         description: Invalid request or not logged in
 *       '403':
 *         description: Something went wrong, please retry login
 */

import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import AppliedJob from '@/models/ApplyJob';
import logger from '@/Utils/logger';
import { httpRequestCount } from '../metrics';

export default async (req, res) => {
    await ConnectDB();
    const { method } = req;
    switch (method) {
        case 'PUT':
            await validateToken(req, res, async () => {
                httpRequestCount.inc({ method: req.method, route: req.url, statusCode: res.statusCode });
                await change_application_status(req, res);
            });
            break;
        default:
            httpRequestCount.inc({ method: req.method, route: req.url, statusCode: 400 });
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}

const change_application_status = async (req, res) => {
    await ConnectDB();
    const data = req.body;
    const { status, id } = data;
    if (!id) {
        httpRequestCount.inc({ method: req.method, route: req.url, statusCode: 400 });
        return res.status(400).json({ success: false, message: "Please Login" })
    }
    try {
        const gettingjobs = await AppliedJob.findByIdAndUpdate(id, { status }, { new: true })
        logger.info('Status Updated Successfully for Id', id);
        return res.status(200).json({ success: true, message: "Status Updated Successfully ", data: gettingjobs })
    } catch (error) {
        console.log('Error in getting a specifed Job job (server) => ', error);
        logger.error('Error in getting a specifed Job job (server) => ', error);
        return res.status(403).json({ success: false, message: "Something Went Wrong Please Retry login !" })
    }
}