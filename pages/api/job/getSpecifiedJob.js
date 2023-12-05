/**
 * @openapi
 * /api/getSpecifiedJob:
 *   get:
 *     summary: Get a specific job
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Job fetched successfully
 *       '400':
 *         description: Invalid request or not logged in
 *       '403':
 *         description: Something went wrong, please retry login
 */

import ConnectDB from '@/DB/connectDB';
import Job from '@/models/Job';
import useUser from '@auth0/nextjs-auth0/client';// Replace 'path-to-useUser' with the correct path to your useUser hook
import logger from '@/Utils/logger';
import { httpRequestCount } from '../metrics';

const GetSpecifiedJob = async (req, res) => {
  const { user, errorMsg, isLoading } = useUser();
  const getSpecifiedJob = async () => {
    await ConnectDB();
    const data = req.query;
    const id = user?.id;
    if (!id) {
      httpRequestCount.inc({ method: req.method, route: req.url, statusCode: 400 });
      return res.status(400).json({ success: false, message: "Please Login" });
    }
    try {
      const gettingjobs = await Job.findById(id).populate('user');
      logger.info('A specified job fetched successfully', gettingjobs);
      httpRequestCount.inc({ method: req.method, route: req.url, statusCode: 200 });
      return res.status(200).json({ success: true, data: gettingjobs });
    } catch (error) {
      httpRequestCount.inc({ method: req.method, route: req.url, statusCode: 403 });
      console.log('Error in getting a specified Job (server) => ', error);
      logger.error('Error in getting a specified Job (server) => ', error);
      return res.status(403).json({ success: false, message: "Something Went Wrong. Please Retry login!" });
    }
  };

  const { method } = req;
  switch (method) {
    case 'GET':
      await getSpecifiedJob();
      break;
    default:
      httpRequestCount.inc({ method: req.method, route: req.url, statusCode: 400 });
      res.status(400).json({ success: false, message: 'Invalid Request' });
  }
};