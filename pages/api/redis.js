import { createRedisKey, getKey } from '../../Services/redis/redisFunctions';

export default async function handler(req, res) {
  const { jobId, email } = req.query;
  const key = createRedisKey(jobId, email);
  try {
    const redisValue = await getKey(key);
    return res.status(200).json({ value: redisValue });
  } catch (error) {
    console.error('Error in redisValue:', error);
    res.status(500).json({ error: 'Failed to get value from Redis' });
  }
}