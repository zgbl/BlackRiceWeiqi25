// pages/api/tournament/[id].js
//import dbConnect from '../../../lib/dbConnect';
import dbConnect from '../../../lib/mongodb';
import Tournament from '../../../models/Tournament';
import allowCors from '../withCors.js';

async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const tournament = await Tournament.findById(id);
        if (!tournament) {
          return res.status(404).json({ success: false, message: 'Tournament not found' });
        }
        res.status(200).json({ success: true, data: tournament });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
}

export default allowCors(handler);

