const allowedOrigins = [
  'http://weiqi.blackrice.top',    // 开发阶段可能从HTTP访问
  'http://forum.blackrice.top',    // 开发阶段可能从HTTP访问
  'https://weiqi.blackrice.top',   // 生产环境通过HTTPS访问
  'https://forum.blackrice.top',   // 生产环境通过HTTPS访问
  'http://localhost:3000',         // 本地开发环境
  'http://localhost:8090',         // 本地前端服务器
  'http://127.0.0.1:8090',         // 本地前端服务器（IP形式）
];

const allowCors = fn => async (req, res) => {
    const origin = req.headers.origin;
    
    // 检查请求来源是否在允许列表中
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    return await fn(req, res);
  };
  
  export default allowCors;