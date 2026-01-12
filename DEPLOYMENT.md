# 部署指南

## 本地部署

### 1. 构建生产版本

```bash
npm run build
```

这将在 `dist` 目录下生成优化后的静态文件。

### 2. 预览生产版本

```bash
npm run preview
```

在本地预览生产构建效果。

### 3. 部署到静态服务器

将 `dist` 目录下的所有文件部署到任何静态文件服务器。

## 部署选项

### Vercel (推荐)

1. 推送代码到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入项目
4. Vercel 会自动检测 Vue 项目并配置构建设置
5. 点击 Deploy

### Netlify

1. 推送代码到 GitHub
2. 访问 [netlify.com](https://netlify.com)
3. 导入项目
4. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击 Deploy

### GitHub Pages

1. 安装 gh-pages：
```bash
npm install -D gh-pages
```

2. 在 `package.json` 中添加部署脚本：
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. 在 `vite.config.js` 中设置 base：
```js
export default defineConfig({
  base: '/your-repo-name/',
  // ...其他配置
})
```

4. 部署：
```bash
npm run deploy
```

### Nginx

1. 构建项目：
```bash
npm run build
```

2. 将 `dist` 目录复制到服务器

3. 配置 Nginx：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. 重启 Nginx：
```bash
sudo nginx -s reload
```

### Apache

1. 构建项目：
```bash
npm run build
```

2. 将 `dist` 目录复制到服务器

3. 在 `dist` 目录下创建 `.htaccess` 文件：
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Docker 部署

### 1. 创建 Dockerfile

```dockerfile
# 多阶段构建
FROM node:18-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. 构建镜像

```bash
docker build -t shuerte-app .
```

### 3. 运行容器

```bash
docker run -p 80:80 shuerte-app
```

## 环境变量

本项目不需要环境变量，所有数据都存储在浏览器 LocalStorage 中。

## 性能优化建议

1. **启用 Gzip 压缩**
   - Nginx:
     ```nginx
     gzip on;
     gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
     ```
   - Apache: 使用 `mod_deflate`

2. **启用 CDN**
   - 将静态资源上传到 CDN
   - 使用 CDN 加速静态资源加载

3. **缓存策略**
   - 设置适当的缓存头
   - 对静态资源使用长期缓存

4. **HTTPS**
   - 使用 Let's Encrypt 免费证书
   - 强制 HTTPS 重定向

## 监控与日志

### Vercel
- 自动提供监控和日志
- 访问控制台查看部署日志

### Netlify
- 提供部署日志和函数日志
- 访问控制台查看

### 自托管
- 使用 Nginx 日志或 Apache 日志
- 集成第三方监控服务（如 Google Analytics）

## 常见问题

### 1. 路由刷新 404

使用 HTML5 History 模式时，刷新页面会导致 404。解决方案：

- Nginx: 配置 `try_files $uri $uri/ /index.html;`
- Apache: 使用 `.htaccess` 重写规则

### 2. 静态资源加载失败

- 检查 `base` 配置是否正确
- 确保所有文件路径正确

### 3. LocalStorage 数据丢失

- LocalStorage 是浏览器本地存储
- 清除浏览器数据会丢失训练记录
- 建议用户定期导出数据

## 备份与恢复

### 导出数据

在浏览器控制台执行：
```javascript
const data = localStorage.getItem('shuerte_history')
console.log(data)
```

### 导入数据

在浏览器控制台执行：
```javascript
localStorage.setItem('shuerte_history', '你的数据')
```

## 安全建议

1. **启用 HTTPS**
2. **设置安全头**
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
3. **定期更新依赖**
   ```bash
   npm audit
   npm audit fix
   ```

## 许可证

MIT License
