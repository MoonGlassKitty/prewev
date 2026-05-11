# Moon Notes 个人博客

这是一个可以直接部署到 GitHub Pages 的纯静态个人 blog。没有构建步骤，也不需要后端服务。

## 文件结构

- `index.html`：博客首页
- `styles.css`：全站样式
- `script.js`：移动端导航、文章筛选和搜索
- `posts/`：文章页面
- `assets/`：图片资源
- `404.html`：GitHub Pages 可识别的自定义 404 页面
- `.nojekyll`：让 GitHub Pages 按普通静态文件发布

## 本地预览

直接用浏览器打开 `index.html` 即可。也可以在当前目录运行：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 部署到 GitHub Pages

不需要申请。你只需要一个 GitHub 账号和一个仓库。

有两种常见发布方式：

1. 用户主页：仓库名必须是 `<你的 GitHub 用户名>.github.io`，访问地址是 `https://<你的 GitHub 用户名>.github.io/`。
2. 项目主页：仓库名可以自定义，访问地址是 `https://<你的 GitHub 用户名>.github.io/<仓库名>/`。

把这个目录推到 GitHub：

```bash
git init
git add .
git commit -m "Create personal blog"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

然后在 GitHub 仓库页面打开：

```text
Settings -> Pages -> Build and deployment -> Source
```

选择：

```text
Deploy from a branch
Branch: main
Folder: /root
```

保存后等待几分钟，在 `Settings -> Pages` 里会看到公开访问地址。

## 自定义内容

- 把 `Moon Notes` 改成你的名字或博客名。
- 把 `hello@example.com` 改成你的邮箱。
- 把页脚 GitHub 链接改成你的 GitHub 主页。
- 新文章可以复制 `posts/start-with-github-pages.html`，改标题、日期和正文，再在 `index.html` 的文章列表里加一张新卡片。

如果你想绑定自己的域名，需要先购买域名，再在 GitHub Pages 和 DNS 服务商那里配置；不绑定域名也可以正常访问。
