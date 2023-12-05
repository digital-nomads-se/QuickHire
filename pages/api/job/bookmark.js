/**
 * @openapi
 * /api/bookmark:
 *   post:
 *     summary: Bookmark a job
 *     responses:
 *       '200':
 *         description: Job bookmarked successfully
 *       '500':
 *         description: Something went wrong, please retry login
 * 
 *   get:
 *     summary: Get bookmarked jobs
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Job bookmarked successfully
 *       '500':
 *         description: Something went wrong, please retry later
 * 
 *   delete:
 *     summary: Delete a bookmarked job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Job removed successfully
 *       '500':
 *         description: Something went wrong, please retry later
 */

import ConnectDB from '@/DB/connectDB';
import bookMarkJob from '@/models/Bookmark';
import Joi from 'joi';
import logger from '@/Utils/logger';
import { httpRequestCount } from '../metrics';

const schema = Joi.object({
    userEmail: Joi.required(),
    job: Joi.required(),
});

export default async (req, res) => {
    await ConnectDB();
    switch (req.method) {
        case "POST":
            httpRequestCount.inc({ method: req.method, route: req.url, statusCode: res.statusCode });
            await bookmark_my_job(req, res);
            break;
        case "GET":
            httpRequestCount.inc({ method: req.method, route: req.url, statusCode: res.statusCode });
            await getBookmark_jobs(req, res);
            break;
        case "DELETE":
            httpRequestCount.inc({ method: req.method, route: req.url, statusCode: res.statusCode });
            await delete_bookmark_job(req, res);
            break;
        default:
            httpRequestCount.inc({ method: req.method, route: req.url, statusCode: 405 });
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

export const bookmark_my_job = async (req, res) => {
    await ConnectDB();
    const data = req.body;
    const { job, userEmail } = data;
    const { error } = schema.validate({ job, userEmail });
    if (error) return res.status(401).json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });
    try {
        const checkAlreadyBookMarked = await bookMarkJob.findOne({ job, userEmail })
        if (checkAlreadyBookMarked) return res.status(401).json({ success: false, message: "This Job is Already in Bookmark" })
        const bookmarkingJob = await bookMarkJob.create({ job, userEmail });
        logger.info('New Job Bookmarked', bookmarkingJob);
        return res.status(200).json({ success: true, message: "Job Bookmarked successfully !" })
    } catch (error) {
        console.log('Error in booking marking a job (server) => ', error);
        logger.error('Error in booking marking a job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry login !" })
    }
}

export const getBookmark_jobs = async (req, res) => {
    const userId = req.query.id;
    if (!userId) return res.status(400).json({ success: false, message: "Please Login" })
    try {
        const getBookMark = await bookMarkJob.find({ userEmail: userId }).populate('job');
        logger.info('Bookmarked Jobs', getBookMark);
        return res.status(200).json({ success: true, message: "Job Bookmarked successfully !", data: getBookMark })
    } catch (error) {
        console.log('Error in getting book mark Job (server) => ', error);
        logger.error('Error in getting book mark Job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry Later !" })
    }
}

export const delete_bookmark_job = async (req, res) => {
    const id = req.body;
    if (!id) return res.status(400).json({ success: false, message: "Please Login" })
    try {
        const deleteBookmark = await bookMarkJob.findByIdAndDelete(id)
        logger.info('Job removed successfully !', deleteBookmark);
        return res.status(200).json({ success: true, message: "Job removed successfully !" })
    } catch (error) {
        console.log('Error in deleting book mark Job (server) => ', error);
        logger.error('Error in deleting book mark Job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry Later !" })
    }
}
