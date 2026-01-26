---
nav: 工具
group:
  title: 通用
  order: 2
---

# URL

## parseUrl
parseUrl 函数用于解析给定的 URL 字符串，并将其各个部分作为对象返回。它使用正则表达式提取 URL 的各个部分，例如协议、主机名、路径和查询参数。

<code src="./demos/parseUrl.tsx"></code>


## parseSearchParams

parseSearchParams 函数用于解析查询字符串，并将其转换为对象。该函数处理同一键的多个值，将其存储在数组中。

<code src="./demos/parseSearchParams.tsx"></code>


## searchParamsToString
searchParamsToString 函数用于将查询参数对象转换回查询字符串。

<code src="./demos/searchParamsToString.tsx"></code>


## pathJoin
pathJoin 函数用于将多个路径段连接成一个完整的路径字符串。它会移除每个段的前导或尾部斜杠，然后再连接它们。

<code src="./demos/pathJoin.tsx"></code>
