# hyphenjs
> 让英文智能断行并添加连字符，实现齐头尾/两端对齐的效果~

----

> 红框里是浏览器默认的文本排版，右侧会有锯齿（至于难不难看就见仁见智啦哈哈）。后者是使用`hyphen(selecter, true)`后的文本排版，整齐得像一块豆腐块！

![原本的文本](./screenshots/hyphen-original.png)

![hyphen排版后的文本](./screenshots/hyphen-js.png)

## Use

```javascript
/**
 * selector 选择器，只要是querySelectorAll支持的都可以
 * deep 是否强制完美对齐，如果不对齐则会有一定的透气空间
 * prefix 设置实例唯一id和生成DOM的class
 * markSymbol 特殊标识符
 **/
hyphen({
    selector: 'p',
    deep: true,
    prefix: 'hyphen',
    markSymbol: '\"\':;,.?()[]{}<>~!@#$%^&*-+=/\\|1234567890'
});
// 简单用法
hyphen('h6');
```
