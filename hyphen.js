/**
 * hyphen.js
 * 文字智能断行，接近齐头尾效果
 **/
var log = console.log.bind(console);

function hyphen(selector) {
    var PREFIX = 'char';
    var SPACE = 32;
    // 需要特殊处理的符号
    var markSymbol = '\"\':;,.?()[]{}<>~!@#$%^&*-+=/\\|1234567890';

    var MARK = markSymbol.split('').map(function(mark) {
        return mark.charCodeAt();
    });

    MARK.push(SPACE);

    var pList = document.querySelectorAll(selector);

    for (var p = 0, len = pList.length; p < len; p++) {
        textProcessor(pList[p]);
    }

    function textProcessor(target) {
        var targetStyle = window.getComputedStyle(target);
        var brHyphen = '-<br/>';
        var br = '<br/>';
        var calcRaw = {
            fontSize: parseFloat(targetStyle['font-size']),
            boxWidth: parseFloat(targetStyle['width']),
            text: target.innerText
        };
        var charArray = calcRaw.text.split('');
        var wordArray = calcRaw.text.split(' ');
        var wordLenArray = wordArray.map(function(word) {
            return word.length;
        });

        var breakMem = [];
        var lines = [];
        var textData = {};
        target.style.whiteSpace = 'nowrap';
        textData = textFactory(target, charArray, calcRaw);

        // 获取断行的所有位置，以及断行是否需要连字符
        for (var k = 1, b = 0, len = charArray.length; k < len; k++) {
            // 寻找刚好尚为超出盒子宽度的一个字符
            if (whetherNeedMoveOn(wordLenArray, charArray, k)) continue;
            var sliceWidth = getAccWidth(textData, charArray, b, k + 1);
            var hyphen = true;
            if (sliceWidth > calcRaw.boxWidth) {
                b = k;

                hyphen = whetherNeedHyphen(wordLenArray, charArray, k);
                breakMem.push({
                    b: b,
                    hyphen: hyphen,
                    char: charArray[b]
                });
            }
        }
        breakMem.unshift({ b: 0 });
        breakMem.push({ b: len });

        // 开始断行
        for (var w = 1, len = breakMem.length; w < len; w++) {
            var sliceText = charArray.slice(breakMem[w - 1].b, breakMem[w].b);
            var breakBr = breakMem[w].hyphen ? brHyphen : br;
            lines.push(sliceText.join('') + ((len - w) == 1 ? '' : breakBr));
        }
        // 替换原来的文本
        target.innerHTML = lines.join('');
    }

    // 获取文本的每个字符宽高
    function textFactory(target, textRaw, calcRaw) {
        var i = 0;
        var spaceCharCode = SPACE;
        var textData = Object.create(null);
        var textDiv = document.createElement('div');
        var textAllData = [];
        textDiv.style.visibility = 'hidden';
        target.appendChild(textDiv);

        function dealWithSingleChar(char) {
            var charCode = char.charCodeAt();
            // 如果已经存在，则跳过不更新
            if (textData[PREFIX + charCode]) {
                return;
            }
            var span = document.createElement('span');
            var charData = {},
                rect = {};
            span.style.fontSize = calcRaw.fontSize;
            span.innerText = char;
            span.id = '__char_id_' + charCode;

            textDiv.appendChild(span);
            rect = span.getBoundingClientRect();

            textData[PREFIX + charCode] = {
                char: char,
                width: rect.width,
                height: rect.height
            };
            // 空格奇怪了，需要特殊处理，不然获取不到宽度
            if (charCode === SPACE) {
                var spanA = document.createElement('span'),
                    spanB = document.createElement('span');
                spanA.innerText = 'x x';
                spanB.innerText = 'xx';
                textDiv.appendChild(spanA);
                textDiv.appendChild(spanB);

                textData[PREFIX + charCode].width = spanA.getBoundingClientRect().width - spanB.getBoundingClientRect().width;
            }
        }

        while (i < textRaw.length) {
            dealWithSingleChar(textRaw[i++]);
        }
        target.removeChild(textDiv);

        return textData;
    }

    // 计算n到m字符间的累计宽度
    function getAccWidth(textData, charArray, from, to) {
        return charArray.slice(from, to).reduce(function(acc, cur) {
            return acc + textData[PREFIX + cur.charCodeAt()].width;
        }, 0);
    }

    // 检查是否需要连字符，单词首字符和非单词内都不需要（包括所有标点符号和空格）
    function whetherNeedHyphen(wordLenArray, charArray, index) {
        var inWordIndex = -1;
        var accIndex = 0;
        var needHyphen = false;
        if (MARK.indexOf(charArray[index].charCodeAt()) > -1) { return needHyphen; }
        wordLenArray.reduce(function(acc, cur, i) {
            if (inWordIndex === -1 && index < (acc + cur + i)) {
                inWordIndex = i;
                accIndex = acc;
            }
            return acc + cur;
        }, 0);
        // 在单词内部
        if (inWordIndex >= 0) {
            needHyphen = true;
            // 是单词的首字符
            if (index === accIndex + inWordIndex) {
                needHyphen = false;
            }
        }
        return needHyphen;
    }

    // 检查是否需要忽略该字符
    function whetherNeedMoveOn(wordLenArray, charArray, index) {
        function isMark(index){
        	return MARK.indexOf(charArray[index].charCodeAt()) > -1;
        }
        var ignore = true;
        if (isMark(index)) {
            // 特殊字符不应该断行
            return ignore;
        } else if (charArray[index - 2] && !isMark(index - 1) && isMark(index - 2)) {
            // 至少让单词连续两个字符才允许断行
            return ignore;
        } else if (isMark(index + 1)) {
            // 不允许尾字符单个
            return ignore;
        }
        return !ignore;
    }

}