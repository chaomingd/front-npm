const fs = require('fs');
const path = require('path');

// 获取命令行参数
const args = process.argv.slice(2);

// 检查是否提供了包名
if (args.length < 2) {
  console.error('Usage: node scripts/create-template.js <package-name> <folder1> <folder2> ...');
  process.exit(1);
}

// 第一个参数是包名
const packageName = args[0];

// 其余参数是文件夹名
const folders = args.slice(1);

// 模版文件夹路径
const templateDir = path.join(__dirname, '../templates');

// 模版文件列表
const templateFiles = [
  'index.ts',
  'index.less',
  'index.md',
  'index.zh-CN.md',
  'demos',
  '__test__/index.test.tsx',
];

// 复制文件/文件夹的函数
const copyTemplate = (src, dest) => {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
      copyTemplate(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
};

// 创建文件夹并复制模版文件的函数
const createFoldersAndCopyTemplates = (packageDir, folderName) => {
  const destDir = path.join(packageDir, folderName);
  fs.mkdirSync(destDir, { recursive: true });
  templateFiles.forEach(file => {
    const src = path.join(templateDir, file);
    const dest = path.join(destDir, file);
    copyTemplate(src, dest);
  });
};

// 包目录路径
const packageDir = path.join(__dirname, '../packages', packageName, 'src');

// 检查包目录是否存在
if (!fs.existsSync(packageDir)) {
  console.error(`Package ${packageName} does not exist.`);
  process.exit(1);
}

// 处理每个文件夹名
folders.forEach(folder => {
  createFoldersAndCopyTemplates(packageDir, folder);
});

console.log('文件夹和模版文件已创建。');
