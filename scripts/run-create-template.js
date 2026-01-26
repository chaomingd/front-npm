const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: pnpm run create <package-name> <folder1> <folder2> ...');
  process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');
const scriptPath = path.join(rootDir, 'scripts', 'create-template.js');

// 构建命令行参数字符串
const command = `node ${scriptPath} ${args.join(' ')}`;

// 在根目录执行命令
execSync(command, { stdio: 'inherit', cwd: rootDir });
