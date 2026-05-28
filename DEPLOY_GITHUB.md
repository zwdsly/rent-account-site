# 部署到 GitHub Pages

## 1. 新建仓库

在 GitHub 新建一个公开仓库，例如：

`rent-account-site`

把本目录里的这些文件上传到仓库根目录：

- `index.html`
- `styles.css`
- `app.js`
- `data.json`

程序发布图片时会自动创建 `uploads/账号id/图片文件`。

## 2. 开启 GitHub Pages

进入仓库：

`Settings` -> `Pages`

选择：

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/root`

保存后，GitHub 会给你一个网址，通常像这样：

`https://你的用户名.github.io/rent-account-site/`

## 3. 创建管理端使用的 Token

进入 GitHub：

`Settings` -> `Developer settings` -> `Personal access tokens` -> `Fine-grained tokens`

创建一个只授权当前仓库的 token：

- Repository access: 只选择这个租号网页仓库
- Permissions: `Contents` 设置为 `Read and write`

复制 token。这个 token 只在你自己的管理电脑上输入，不要发给客户。

## 4. 在线编辑并发布数据

打开你的 GitHub Pages 网址，点击右下角齿轮，输入管理密钥进入管理端。

在 `GitHub同步` 区填写：

- 用户名：你的 GitHub 用户名
- 仓库名：例如 `rent-account-site`
- 分支：通常是 `main`
- 数据文件：`data.json`
- GitHub Token：上一步复制的 token

编辑商品后点击 `保存账号`，再点击 `发布到GitHub`。

发布成功后，客户刷新网页就能看到新的商品数据。GitHub Pages 有时会延迟几十秒。

发布时会做这些事：

- 新上传的本地图片会保存到 `uploads/账号id/`。
- `data.json` 只保存图片路径，不保存图片本体。
- 如果你删除了商品，或从商品里删除了某张旧图，发布时会删除 GitHub 上不再被任何商品引用的 `uploads/` 图片文件。

## 注意

GitHub 是 Git 仓库，网页当前版本里的文件会被删除；但 Git 历史里可能还保留旧图片。几百 MB 内通常够用。如果以后仓库接近 1GB，可以新建干净仓库迁移一次，或做 Git 历史清理。

## 5. 苹果手机添加到桌面

部署到 GitHub Pages 后，用 iPhone Safari 打开网址：

1. 点击底部分享按钮。
2. 选择 `添加到主屏幕`。
3. 确认名称后添加。

添加后会像独立应用一样从桌面打开。PWA 需要 HTTPS，GitHub Pages 的网址默认就是 HTTPS。
