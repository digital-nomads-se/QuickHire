/**
 * @openapi
 * /api/getPostedJobs:
 *   get:
 *     summary: Get all jobs posted by a specific user
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Posted jobs fetched successfully
 *       '400':
 *         description: Invalid request or not logged in
 *       '403':
 *         description: Something went wrong, please retry login
 */

import ConnectDB from '@/DB/connectDB';
import validateToken from '@/middleware/tokenValidation';
import Job from '@/models/Job';


export default async (req, res) => {
    await ConnectDB();
    const { method } = req;
    switch (method) {
        case 'GET':
            await validateToken(req, res, async () => {
                await getPostedJobs(req, res);
            });
            break;
        default:
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}


const getPostedJobs =  async (req, res) => {
    await ConnectDB();
    const data = req.query;
    const id = data?.id

    if(!id) return res.status(400).json({ success: false, message: "Please Login" })

    try {
        const gettingjobs = await Job.find({user : id}).populate('user', 'name email');
        return res.status(200).json({ success: true, data: gettingjobs })
    } catch (error) {
        console.log('Error in getting a specifed Job job (server) => ', error);
        return res.status(403).json({ success: false, message: "Something Went Wrong Please Retry login !" })
    }
}