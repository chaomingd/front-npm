---
nav: 指南
group:
  title: 其他
  order: 4
---
# 贡献指南


2. 新建分支
```
git checkout -b feat/xxx
```

3. 提交代码
```
git add .
git commit -m 'feat: xxx'
git push origin feat/xxx
```

4. 提交pr

## 发布

执行 pnpm release
```
pnpm release
```


## 快速创建模版
将design 换成你想要添加到的包下
```
pnpm run create design 文件夹名称
```
