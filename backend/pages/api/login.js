// pages/api/login.js
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import Cors from 'cors';

const allowedOrigins = [
  'http://weiqi.blackrice.top',    // 开发阶段可能从HTTP访问
  'http://forum.blackrice.top',    // 开发阶段可能从HTTP访问
  'https://weiqi.blackrice.top',   // 生产环境通过HTTPS访问
  'https://forum.blackrice.top',   // 生产环境通过HTTPS访问
  'http://localhost:3000',         // 本地开发环境
  'http://localhost:8090',         // 本地前端服务器
  'http://127.0.0.1:8090',         // 本地前端服务器（IP形式）
];

// Initialize the cors middleware
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: function (origin, callback) {
    // 允许没有origin的请求（比如移动应用）
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Connect to database
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ 
      message: 'Login successful', 
      user: {
        id: user._id,
        username: user.username,
      },
      redirectTo: '/Forum11.html'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
}