// config.js
const CONFIG = {
    // 根据当前域名自动选择API地址
    API_BASE_URL: (() => {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return "http://localhost:3000";
        } else if (hostname === 'weiqi.blackrice.top' || hostname === 'forum.blackrice.top') {
            // 如果在GitHub Pages上，使用相对路径或指定的API服务器
            return `${protocol}//${hostname}/api`;
        } else {
            // 默认使用localhost
            return "http://localhost:3000";
        }
    })(),
    
    API_VERCEL_NEXTJS_BASE_URL: (() => {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return "http://localhost:3000";
        } else if (hostname === 'weiqi.blackrice.top' || hostname === 'forum.blackrice.top') {
            return `${protocol}//${hostname}/api`;
        } else {
            return "http://localhost:3000";
        }
    })(),
    
    GITHUB_PAGE_FORUM_URL: "https://zgbl.github.io/tigergo/Forum11.html",
    FORUM_POST_ENDPOINT: "/forum/post",
};