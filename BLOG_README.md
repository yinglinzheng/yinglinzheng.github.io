# 博客系统使用说明

## 快速开始

### 添加新文章

#### 方法 1：使用模板（推荐）

1. 生成模板文件：
```bash
npm run blog:template
```

2. 这会创建一个 `public/blog/template.md` 文件，复制它并重命名：
```bash
cp public/blog/template.md public/blog/my-new-article.md
```

3. 编辑文件，修改 frontmatter 和正文内容

4. 生成索引：
```bash
npm run blog:generate
```

#### 方法 2：手动创建

1. 在 `public/blog/` 目录下创建新的 `.md` 文件

2. 在文件头部添加 YAML frontmatter：
```yaml
---
id: unique-post-id
title: 文章标题
date: 2024-01-15
author: 郑英林
category: AI沉思录
tags: 标签一, 标签二
excerpt: 文章摘要，会显示在列表中
---
```

3. 下面开始写正文（支持 Markdown 语法）

4. 运行生成脚本：
```bash
npm run blog:generate
```

## 文章格式说明

### Frontmatter 字段

| 字段 | 必填 | 说明 |
|------|------|------|
| id | 可选 | 文章唯一标识，默认使用文件名 |
| title | **必填** | 文章标题 |
| date | 可选 | 发布日期，默认今天 |
| author | 可选 | 作者，显示在文章页页头；不填则不显示 |
| category | 可选 | 所属**专栏**，单选，默认"未分类"。列表页按专栏聚合 |
| tags | 可选 | **标签**，多个用逗号分隔（中英文逗号、顿号均可），如 `tags: AI偏见, 大模型, RLHF` |
| excerpt | 可选 | 摘要，默认自动提取正文前150字 |

### 专栏与标签

- **专栏（category）** 一篇文章只归一个专栏，是列表页的分区维度，例如 `AI沉思录`、`教育观察`。
- **标签（tags）** 一篇文章可挂多个标签，用于跨专栏横向检索。
- 列表页顶部的筛选条支持「专栏 + 标签」组合筛选，筛选状态写在 URL 里，可直接分享，例如：
  `https://yinglinzheng.github.io/#/blog?column=AI沉思录&tag=RLHF`
- 专栏和标签的可选值由脚本从文章中自动聚合，**不需要另外维护清单**；文章少时筛选条会自动隐藏或简化。

### Markdown 支持

- 标题：`# H1`, `## H2`, `### H3`
- 加粗：`**文字**`
- 斜体：`*文字*`
- 代码：`` `code` `` 或代码块
- 列表：`- 项目` 或 `1. 项目`
- 链接：`[文字](URL)`
- 图片：`![描述](图片URL)`
- 引用：`> 引用文字`
- 表格：标准 Markdown 表格语法
- 数学公式：支持 LaTeX 语法（`$公式$` 或 `$$公式$$`）

### 代码高亮

使用代码块并指定语言：

```python
def hello():
    print("Hello, World!")
```

支持的语言：python, javascript, typescript, css, html, bash, yaml, json 等

## 示例文章结构

```markdown
---
id: my-article
title: 我的文章标题
date: 2024-01-15
category: 技术
excerpt: 这是一篇关于xxx的技术文章
---

# 文章标题

开篇介绍...

## 第一部分

内容...

### 子标题

- 要点 1
- 要点 2
- 要点 3

## 代码示例

```python
def example():
    return "Hello World"
```

## 总结

文章总结...

---

*作者：你的名字*
```

## 注意事项

1. **id 必须唯一**，否则会导致路由冲突
2. **日期格式**：YYYY-MM-DD
3. **文件编码**：建议使用 UTF-8
4. **图片路径**：相对路径，放在 `public/` 目录下
5. **自动生成摘要**：如果不写 excerpt，会自动提取正文前150字

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 生成博客索引
npm run blog:generate

# 创建文章模板
npm run blog:template

# 构建生产版本
npm run build
```

## 文件结构

```
public/blog/
├── posts.json          # 文章索引（自动生成）
├── template.md         # 文章模板（可选）
├── article-1.md        # 文章 1
├── article-2.md        # 文章 2
└── ...
```

## 故障排除

### 文章没有显示

1. 检查是否运行了 `npm run blog:generate`
2. 检查 frontmatter 格式是否正确（必须有 `---` 包围）
3. 检查 `posts.json` 是否包含该文章

### 文章格式错误

1. 确保 frontmatter 在文件最开头
2. 确保 `---` 前后没有多余空格
3. 检查 YAML 语法（键值对用冒号+空格分隔）

### 代码没有高亮

1. 确保代码块指定了语言：```python
2. 支持的常见语言：python, javascript, typescript, css, html, bash
