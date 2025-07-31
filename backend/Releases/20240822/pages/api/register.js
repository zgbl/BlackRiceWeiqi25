//This project use Next.js + Vercel + serverless RESTFUL Stateless API

// pages/api/register.js
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
//import Cors from 'cors';


// Custom CORS middleware to handle preflight requests and set headers
const allowCors = (fn) => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
    if (req.method === 'OPTIONS') {
      res.status(200).end(); // Respond to preflight request
      return;
    }
  
    return await fn(req, res);
  };
  

//export default async function handler(req, res) {
export default allowCors(async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    // 处理 GET 请求
    return res.status(200).json({
      message: "This is the GET endpoint for /register. Use this to check if the route is accessible.",
      hint: "Try sending a POST request with valid registration data.",
      examplePostBody: {
        username: "testuser",
        email: "testuser@example.com",
        password: "password123"
      },
      availableRoutes: [
        { method: "GET", path: "/api/register", description: "This endpoint for testing purposes" },
        { method: "POST", path: "/api/register", description: "Register a new user" },
      ]
    });
  }

  if (req.method === 'POST') {
    // 处理 POST 请求（注册逻辑）
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }
  

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, email, password: hashedPassword });
      return res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating user', error });
    }
  } 

  // 对其他 HTTP 方法返回 405 错误
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
});
