# SBTI 人格测试

> Forked from [pingfanfan/SBTI](https://github.com/pingfanfan/SBTI)

一个开源的娱乐性人格测试项目，基于 B站UP主 [@蛆肉儿串儿](https://space.bilibili.com/417038183) 的原创测试。

## 在线体验

[点击体验](https://sbti.chenlong716.dpdns.org/)

[备用链接](https://epiphany-cl.github.io/SBTI-Gallery/)

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 构建并部署到 GitHub Pages
npm run build:pages

# 预览构建结果
npm run preview
```

## 项目结构

```
SBTI-Gallery/
├── data/              # 测试数据（题目、维度、配置）
├── src/               # 源代码
│   ├── main.js        # 入口文件
│   ├── quiz.js        # 答题逻辑
│   ├── result.js      # 结果计算
│   ├── chart.js       # 雷达图绘制
│   ├── share.js       # 分享图片生成
│   ├── engine.js      # 匹配算法
│   ├── gallery.js     # 画廊页面
│   └── style.css      # 样式文件
├── gallery/           # 人格图鉴页面
├── public/            # 静态资源
└── index.html         # 主页面
```

## 部署

本项目为纯静态站点，可以部署到任意静态托管服务：

- **GitHub Pages**: 已配置 `build:pages` 脚本适配 GitHub Pages 路径
- **Vercel / Netlify**: 直接连接仓库即可
- **自建服务器**: 运行 `npm run build` 后部署 `dist/` 目录

## 许可证

继承原项目的开源协议

## 免责声明

本测试仅供娱乐使用，不构成专业心理学评估。
