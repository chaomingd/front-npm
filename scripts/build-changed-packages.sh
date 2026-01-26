#!/bin/bash

# 获取上一次发布的标签
last_tag=$(git describe --tags --abbrev=0)

# 检查是否有变更的包
changed_packages=$(pnpm changeset status --since $last_tag | grep '✓' | awk '{print $3}')

# 检查是否有变更
if [ -z "$changed_packages" ]; then
  echo "No changes since last release."
  exit 0
fi

# 按需打包有变更的包
for package in $changed_packages
do
  pnpm --filter $package build
done
