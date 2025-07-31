// /api/comments.js
import dbConnect from '../../lib/mongodb';
import Comment from '../../models/Comment'; // Assuming you have a Comment model similar to User

const allowedOrigins = [
  'http://weiqi.blackrice.top',    // 开发阶段可能从HTTP访问
  'http://forum.blackrice.top',    // 开发阶段可能从HTTP访问
  'https://weiqi.blackrice.top',   // 生产环境通过HTTPS访问
  'https://forum.blackrice.top',   // 生产环境通过HTTPS访问
  'http://localhost:3000',         // 本地开发环境
  'http://localhost:8090',         // 本地前端服务器
  'http://127.0.0.1:8090',         // 本地前端服务器（IP形式）
];

// Custom CORS middleware to handle preflight requests and set headers
const allowCors = (fn) => async (req, res) => {
  const origin = req.headers.origin;
  
  // 检查请求来源是否在允许列表中
  if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); // Allow specific methods
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Respond to preflight request
    return;
  }

  return await fn(req, res);
};

const getComments = async (postId) => {
  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    return { success: true, comments };
  } catch (error) {
    return { success: false, error: 'Error fetching comments' };
  }
};

const addComment = async (postId, text, username) => {
  try {
    const newComment = await Comment.create({ postId, text, username });
    return { success: true, comment: newComment };
  } catch (error) {
    return { success: false, error: 'Error adding comment' };
  }
};

export default allowCors(async function handler(req, res) {
  await dbConnect();

  const { postId } = req.query;

  if (!postId) {
    return res.status(400).json({ success: false, message: 'Missing postId' });
  }

  if (req.method === 'GET') {
    // Handle GET request to fetch comments
    const response = await getComments(postId);
    if (response.success) {
      return res.status(200).json(response.comments);
    } else {
      return res.status(500).json({ success: false, message: response.error });
    }
  }

  if (req.method === 'POST') {
    // Handle POST request to add a comment
    const { text, username } = req.body;

    if (!text || !username) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const response = await addComment(postId, text, username);
    if (response.success) {
      return res.status(201).json(response.comment);
    } else {
      return res.status(500).json({ success: false, message: response.error });
    }
  }

  // For other HTTP methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
});
