# 摄影作品导入

## 1. 从 Lightroom 导出

先完成调色，再导出全尺寸 JPEG：

- 色彩空间：sRGB
- 品质：90–100
- 不限制文件大小，不需要自己预先缩放
- 保留 EXIF 元数据
- 不添加水印；需要水印时先在网站中统一设计

源图只保存在本机的 `photography-source/`，该目录已被 Git 忽略，不会上传到公开仓库。

## 2. 建立照片组

每个时间轴条目对应一个文件夹。文件夹名建议使用日期和英文短名：

```text
photography-source/
└── 2026-07-15-summer-night/
    ├── group.json
    ├── 01.jpg
    ├── 02.jpg
    └── 03.jpg
```

`group.json` 示例：

```json
{
  "id": "2026-07-15-summer-night",
  "capturedOn": "2026-07-15",
  "title": "夏夜散步",
  "location": "北京",
  "photos": [
    { "file": "01.jpg", "alt": "路灯下经过树影的行人" },
    { "file": "02.jpg", "alt": "雨后路面映出的暖色灯光" },
    { "file": "03.jpg", "alt": "夜色中的街道尽头" }
  ]
}
```

规则：

- `id` 只使用小写英文字母、数字和连字符，并且发布后尽量不要修改。
- `capturedOn` 使用 `YYYY-MM-DD`。
- `photos` 的第一张是时间轴封面；其余照片按数组顺序浏览。
- `alt` 描述画面内容，不要写“图片 1”之类无信息文本。
- 若省略 `photos`，脚本会按文件名自然排序导入文件夹内全部 JPG。

## 3. 压缩并生成页面数据

在项目根目录执行：

```bash
npm run photos:build
```

脚本会自动：

- 依据 EXIF 校正横竖方向。
- 为时间轴生成最长边 1600px、最大约 1 MiB 的缩略图。
- 为大图查看器生成最长边 3840px、最大约 5 MiB 的高清展示图。
- 转换为 sRGB JPEG，并读取相机、镜头、光圈、快门、ISO、焦距。
- 将结果写入 `public/photography/`。
- 将页面数据写入 `app/photography/archive.generated.json`，并按日期从新到旧排序。

每次运行都会用源目录的完整内容重建网页图片。要保留某一照片组，就必须继续保留其源文件夹。

## 4. 本地检查与发布

```bash
npm run dev
```

打开 `http://localhost:3000/photography/` 检查封面顺序、横竖图、EXIF、压缩图/原图切换和手机布局。
确认无误后：

```bash
npm test
npm run lint
git add app/photography/archive.generated.json public/photography
git commit -m "Add photography archive"
git push
```

推送后 GitHub Pages 会自动构建。网页压缩图会进入公开 Git 仓库；不要把 Lightroom 源图目录强制加入 Git。
