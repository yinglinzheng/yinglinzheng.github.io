#!/usr/bin/env node

/**
 * 博客文章索引生成脚本
 * 自动扫描 blog 目录下的 Markdown 文件，生成 posts.json 索引
 * 
 * 使用方法:
 * 1. 在 blog 目录下添加新的 .md 文件
 * 2. 在文件头部添加 YAML frontmatter:
 *    ---
 *    id: unique-post-id
 *    title: 文章标题
 *    date: 2024-01-15
 *    category: 技术
 *    excerpt: 文章摘要
 *    ---
 * 
 * 3. 运行: node scripts/generate-blog-index.cjs
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'public', 'blog');
const OUTPUT_FILE = path.join(BLOG_DIR, 'posts.json');

// 解析 Markdown 文件的 frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return null;
  }
  
  const frontmatter = match[1];
  const body = match[2];
  
  // 解析 YAML
  const metadata = {};
  const lines = frontmatter.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // 移除引号
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      metadata[key] = value;
    }
  }
  
  return { metadata, body };
}

// 生成文章摘要（从正文提取前150个字符）
function generateExcerpt(body, maxLength = 150) {
  // 移除 Markdown 标记
  const plainText = body
    .replace(/#+ /g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
}

// 生成文件 ID（从文件名）
function generateId(filename) {
  return filename.replace(/\.md$/i, '');
}

// 主函数
async function generateIndex() {
  console.log('📝 正在生成博客文章索引...\n');
  
  try {
    // 读取 blog 目录
    const files = fs.readdirSync(BLOG_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md');
    
    if (mdFiles.length === 0) {
      console.log('⚠️  没有找到 Markdown 文件');
      return;
    }
    
    const posts = [];
    
    for (const filename of mdFiles) {
      const filepath = path.join(BLOG_DIR, filename);
      const content = fs.readFileSync(filepath, 'utf-8');
      const parsed = parseFrontmatter(content);
      
      if (!parsed) {
        console.log(`⚠️  跳过 ${filename}: 没有找到 frontmatter`);
        continue;
      }
      
      const { metadata, body } = parsed;
      
      // 验证必需的字段
      if (!metadata.title) {
        console.log(`⚠️  跳过 ${filename}: 缺少 title`);
        continue;
      }
      
      const post = {
        id: metadata.id || generateId(filename),
        title: metadata.title,
        date: metadata.date || new Date().toISOString().split('T')[0],
        category: metadata.category || '未分类',
        excerpt: metadata.excerpt || generateExcerpt(body),
        file: filename
      };
      
      posts.push(post);
      console.log(`✅ 已添加: ${post.title}`);
    }
    
    // 按日期排序（最新的在前）
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 写入 posts.json
    const output = { posts };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
    
    console.log(`\n✨ 成功生成索引！共 ${posts.length} 篇文章`);
    console.log(`📄 输出文件: ${OUTPUT_FILE}\n`);
    
  } catch (error) {
    console.error('❌ 生成索引失败:', error.message);
    process.exit(1);
  }
}

// 创建示例文章模板
function createTemplate() {
  const template = `---
id: my-new-post
title: 新文章标题
date: ${new Date().toISOString().split('T')[0]}
category: 技术
excerpt: 这是一篇新文章的摘要，会显示在文章列表中
---

# 新文章标题

在这里开始写作...

## 二级标题

正文内容支持 **加粗**、*斜体*、\`代码\` 等 Markdown 语法。

### 代码示例

\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

### 列表

- 项目 1
- 项目 2
- 项目 3

### 引用

> 这是一段引用文字

---

*文章结束*
`;

  const templatePath = path.join(BLOG_DIR, 'template.md');
  fs.writeFileSync(templatePath, template, 'utf-8');
  console.log(`📝 已创建模板文件: ${templatePath}\n`);
}

// 命令行参数处理
const args = process.argv.slice(2);

if (args.includes('--template') || args.includes('-t')) {
  createTemplate();
} else {
  generateIndex();
}
