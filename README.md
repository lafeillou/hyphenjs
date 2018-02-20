# hyphenjs

> 让英文智能断行并添加连字符，实现齐头尾/两端对齐的效果~

----

> 红框里是浏览器默认的文本排版，右侧会有锯齿（至于难不难看就见仁见智啦哈哈）。后者是使用`hyphen(selecter, true)`后的文本排版，整齐得像一块豆腐块！

![原本的文本](./screenshots/hyphen-original.png)

![hyphen排版后的文本](./screenshots/hyphen-js.png)

## 特性支持

- 强制文本两端对齐
- 缓存节点优化性能
- 判断智能断行时机并添加连字符

## 使用说明

```javascript

new Hyphen({
  el: '.text'
})

```

`\"\':;,.?()[]{}<>~!@#$%^&*-+=/\|1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ