import ConnectDB from '@/DB/connectDB';
import Job from '@/models/Job';
import useUser from '@auth0/nextjs-auth0/client';// Replace 'path-to-useUser' with the correct path to your useUser hook

const GetSpecifiedJob = async (req, res) => {
  const { user, errorMsg, isLoading } = useUser();

  const getSpecifiedJob = async () => {
    await ConnectDB();
    const data = req.query;
    const id = user?.id;

    if (!id) return res.status(400).json({ success: false, message: "Please Login" });

    try {
      const gettingjobs = await Job.findById(id).populate('user');
      return res.status(200).json({ success: true, data: gettingjobs });
    } catch (error) {
      console.log('Error in getting a specified Job (server) => ', error);
      return res.status(403).json({ success: false, message: "Something Went Wrong. Please Retry login!" });
    }
  };

  const { method } = req;
  switch (method) {
    case 'GET':
      await getSpecifiedJob();
      break;
    default:
      res.status(400).json({ success: false, message: 'Invalid Request' });
  }
};