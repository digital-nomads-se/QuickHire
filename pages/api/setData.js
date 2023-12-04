import { setKey } from '../../Services/redis/redisFunctions';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { key, value } = req.body;
      await setKey(key, value);
    //   return await getKey(key);
      res.status(200).json({ message: 'Key set successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error setting key', error });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
