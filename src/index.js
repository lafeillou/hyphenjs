/**
 * 文本齐头尾
 */

(function (root) {
    var SPACE = 32;
    var utils = {
        extend: function (from, to) {
            for (var prop in to) from[prop] = to[prop];
            return from;
        },
        // 生成唯一id
        getUniqueId: function (prefix, text) {
            return prefix + '_' + text.split('').map(function (c) {
                return c.charCodeAt();
            }).join('');
        },
        warn: function(text) {
            console.warn(text);
        }
    };

    function hyphen(conf) {
        if (!(this instanceof hyphen)) return new hyphen(conf);
        var conf = conf || {};
        var _conf = {
            selector: 'p',
            deep: true,
            prefix: 'hyphen',
            markSymbol: '\"\':;,.?()[]{}<>~!@#$%^&*-+=/\\|1234567890'
        };
        if (typeof conf === 'string') {
            _conf.selector = conf;
            this.$conf = _conf;
        } else {
            this.$conf = utils.extend(_conf, conf);
        }
        this.init();
    }
    hyphen.__memory__ = [];
    hyphen.prototype = {
        constructor: hyphen,
        init: function () {
            var conf = this.$conf;
            var self = this;
            this.$id = utils.getUniqueId(conf.prefix, conf.selector);
            if(hyphen.__memory__.indexOf(this.$id) > -1) {
                utils.warn('hyphen warning: selector "' + conf.selector + '" can\'t hyphen twice.')
                return;
            }
            hyphen.__memory__.push(this.$id);
            // 数据缓存
            this.$cached = Object.create(null);
            // 特殊符号标记
            this.$markset = conf.markSymbol.split('').map(function (c) {
                return c.charCodeAt();
            }).concat([SPACE]);

            var list = document.querySelectorAll(conf.selector);

            list.forEach(function (target, index) {
                self.storeCached(target, index);
                self.wrapText(target);
            });
        },
        wrapText: function (target) {
            target.style.whiteSpace = 'nowrap';
            var text = target.innerText;
            var charArray = text.split('');
            var fullCharArray = charArray.concat(this.$conf.markSymbol.split(''));
            var targetStyle = this.calcStyle(target);
            var wordLenArray = text.split(' ').map(function (word) {
                return word.length;
            });
            var textCharMap = this.getAllCharRectData(target, fullCharArray);
            var textAnalData = [];
            // 遍历获取断行的所有位置，以及断行是否需要连字符
            for (var k = 0, b = 0, len = charArray.length; k < len; k++) {
                var charDistance = this.getTwoCharDistance(charArray, textCharMap, b, k + 1);
                if (charDistance > targetStyle.width) {
                    b = k;
                    textAnalData.push({
                        br: b,
                        hyphen: true,
                        char: charArray[b]
                    });
                }
            }
            // 添加开始一行
            textAnalData.unshift({ br: 0 });
            // 添加结尾一行
            textAnalData.push({ br: len });

            var singleLineArray = [];
            for (var t = 1, len = textAnalData.length; t < len; t++) {
                var lineText = charArray.slice(textAnalData[t - 1].br, textAnalData[t].br);
                var renderText = '';
                if (t === len - 1) {
                    renderText = this.renderLineString(lineText.join(''));
                } else {
                    renderText = this.renderLineString(
                        lineText.join(''),
                        this.getLineLetterSpacing(textCharMap, lineText, targetStyle.width)
                    );
                }
                singleLineArray.push(renderText);
            }
            target.innerHTML = singleLineArray.join('');
        },
        renderLineString: function (text, spacing) {
            return [
                '<span style="display: inline-block; ',
                'letter-spacing:' + (spacing ? spacing : 0) + 'px;">',
                text,
                '</span><br/>'].join('');
        },
        getTwoCharDistance: function (charArray, charMap, from, to) {
            return charArray.slice(from, to).reduce(function (acc, cur) {
                return cur ? (acc + charMap[cur.charCodeAt()].width) : acc;
            }, 0);
        },
        getLineLetterSpacing: function (charMap, lineText, containerWidth) {
            var size = lineText.length;
            var lineWidth = this.getTwoCharDistance(lineText, charMap, 0, size);
            return (containerWidth - lineWidth) / size;
        },
        // 获取文本对象中所有字符的宽高数据
        getAllCharRectData(target, charArray) {

            // 存储文本对象中所有字符的数据
            var charMap = Object.create(null);
            var div = document.createElement('div');
            target.appendChild(div);
            for (var i = 0, len = charArray.length; i < len; i++) {
                var char = charArray[i];
                var code = char.charCodeAt();
                var rect = null;
                if (charMap[code]) continue;
                var span = document.createElement('span');
                span.innerText = char;
                div.appendChild(span);
                rect = span.getBoundingClientRect();
                charMap[code] = {
                    char: char,
                    width: rect.width,
                    height: rect.height
                };
            }
            charMap[SPACE] = this.getSpaceCharRectData(div);
            target.removeChild(div);
            
            return charMap;
        },
        getSpaceCharRectData(container) {
            var a = document.createElement('span'),
                b = document.createElement('span');
            a.innerText = '_ _';
            b.innerText = '__';
            container.appendChild(a);
            container.appendChild(b);
            var bcrA = a.getBoundingClientRect(),
                bcrB = b.getBoundingClientRect();
            return {
                char: ' ',
                width: bcrA.width - bcrB.width,
                height: bcrA.height
            };
        },
        storeCached: function (target, index) {
            if (!this.$cached[index]) {
                this.$cached[index] = {
                    orginHtml: target.innerHTML,
                    originText: target.innerText
                };
            }
        },
        calcStyle: function (target) {
            var containerStyle = root.getComputedStyle(target);
            return {
                fontSize: root.parseFloat(containerStyle['font-size']),
                width: root.parseFloat(containerStyle['width'])
            };
        }
    };

    root.hyphen = hyphen;
})(window);