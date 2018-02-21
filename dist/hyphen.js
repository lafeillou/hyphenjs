var Hyphen =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;
exports.attr = attr;
exports.style = style;
exports.makePureArray = makePureArray;
exports.warn = warn;
/**
 * Common utils
 */

function extend(from, to) {
  for (var prop in to) {
    from[prop] = to[prop];
  }return from;
}

function attr(node, name, value) {
  if (value === undefined) {
    return node.getAttribute(name);
  } else {
    return node.setAttribute(name, value);
  }
}

function style(node, name, value) {
  if (value === undefined) {
    return node.style[name] || window.getComputedStyle(node)[name];
  } else {
    return node.style[name] = value;
  }
}

// remove duplicate primitive value in array
function makePureArray(arr) {
  var newArr = [];
  var len = arr.length;
  var i = 0;
  while (i < len) {
    var v = arr[i++];
    if (newArr.indexOf(v) < 0) {
      newArr.push(v);
    }
  }
  return newArr;
}

function warn() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  console.warn("[Hyphen warn:] " + args);
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mixin = __webpack_require__(2);

var _mixin2 = _interopRequireDefault(_mixin);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * hyphen.js
 * develop by 1kg
 * use it to make the text align neatly.
 */
function Hyphen() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!(this instanceof Hyphen)) {
    (0, _utils.warn)('Hyphen is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

(0, _mixin2.default)(Hyphen);

exports = module.exports = Hyphen;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _observer = __webpack_require__(3);

var _observer2 = _interopRequireDefault(_observer);

var _render = __webpack_require__(4);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LIFE_CYCLE = ['beforeRender', 'render', 'afterRender'];

var noop = function noop() {};

// prepare all text data
var initNodeData = function initNodeData(h) {
  var options = h.options;
  var nodeList = document.querySelectorAll(options.el);
  var nodes = Array.from(nodeList);
  // store each node data
  var hNodes = [];

  nodes.forEach(parseNode);
  h.nodes = hNodes;
  // parse single node to get box's width, font-size
  // and each char's width
  function parseNode(node) {
    var text = node.innerText;
    var nodeWidth = parseFloat((0, _utils.style)(node, 'width')).toFixed(options.fixed);
    var nodeFontSize = (0, _utils.style)(node, 'font-size');
    var nodeFontFamily = (0, _utils.style)(node, 'font-family');
    var nodeFontWeight = (0, _utils.style)(node, 'font-weight');
    var chars = (0, _utils.makePureArray)(text.split(''));
    chars.push('-');
    // insert a span which has a char to body
    // and get char's real render's width
    var spans = Object.create(null);
    var div = document.createElement('div');
    (0, _utils.style)(div, 'font-size', nodeFontSize);
    (0, _utils.style)(div, 'font-family', nodeFontFamily);
    (0, _utils.style)(div, 'font-weight', nodeFontWeight);
    // style(div, 'transform', 'scale(0)')
    chars.forEach(function (char) {
      var span = document.createElement('span');
      var code = char.charCodeAt();
      span.innerText = char;
      spans[code] = { span: span, char: char, code: code
        // auto inherit parent node's font-size and font-family
      };div.appendChild(span);
    });
    document.body.appendChild(div);
    for (var k in spans) {
      var v = spans[k];
      v.width = v.span.getBoundingClientRect()['width'].toFixed(options.fixed);
    }
    document.body.removeChild(div);

    hNodes.push({
      node: node,
      nodeWidth: nodeWidth,
      spans: spans
    });
  }
};

// subscribe all lifecycle event
var initLifecycle = function initLifecycle(h) {
  LIFE_CYCLE.forEach(function (name) {
    var hook = h.options[name] || noop;
    h.wisper.subscribe(name, hook);
  });
};

var initRenderEvent = function initRenderEvent(h) {
  (0, _render.callBeforeRender)(h);
  // call hook: beforeRender
  h.wisper.next.call(h, 'beforeRender');
  // main render function
  (0, _render.callInRender)(h);
  // when render function done
  (0, _render.callAfterRender)(h);
  // call hook: afterRender
  h.wisper.next.call(h, 'afterRender');
};

var initWisper = function initWisper(h) {
  // set a wisper to deliver message
  var wisper = new _observer2.default();
  h.wisper = wisper;
  // set _listeners reference to Hyphen instance
  h = (0, _utils.extend)(h, h.wisper);
};

function initMixin(Hyphen) {
  Hyphen.prototype._init = function (options) {
    var h = this;
    // expose real self
    h._self = this;
    this.options = (0, _utils.extend)({
      name: 'hyphen',
      el: 'p',
      leftMin: 2,
      rightMin: 2,
      move: 8,
      fixed: 3
    }, options);

    initWisper(h);
    initLifecycle(h);
    initNodeData(h);
    initRenderEvent(h);
  };
}

exports.default = initMixin;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Event emitter
 */

function Observer() {
  this._listeners = {};
}

Observer.prototype = {
  constructor: Observer,
  subscribe: function subscribe(name, fn) {
    var listeners = this._listeners;
    var handlers = listeners[name] || (listeners[name] = []);
    handlers.push(fn);
  },
  unsubscribe: function unsubscribe(name, fn) {
    var listeners = this._listeners[name];
    if (listeners) listeners.splice(listeners.indexOf(fn), 1);
  },
  next: function next(name) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var listeners = this._listeners[name];
    if (listeners) {
      listeners.forEach(function (h) {
        return h.apply(_this, args);
      });
    }
  }
};

exports.default = Observer;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callBeforeRender = callBeforeRender;
exports.callInRender = callInRender;
exports.callAfterRender = callAfterRender;

var _utils = __webpack_require__(0);

var excludeHyphenChar = '`1234567890-=[]\;\',./~!@#$%^&*()_+{}|:"<>?';

// make text single line to break manually
function callBeforeRender(h) {
  var hNodes = h.nodes;
  hNodes.forEach(function (node) {
    (0, _utils.style)(node.node, 'white-space', 'nowrap');
  });
}

function callInRender(h) {
  var hNodes = h.nodes;

  hNodes.forEach(function (node) {
    var lines = breakTextToLines(node);
    var spaces = calcLetterSpacing(node, lines);
    // render each line to a block div
    renderLines(node, lines, spaces);
    // render a node
    h.wisper.next.call(h, 'render');
  });

  // According to the width of the box's width, break text to lines 
  function breakTextToLines(node) {
    var chars = node.node.innerText.split('');
    var nodeWidth = parseFloat(node.nodeWidth);
    var spans = node.spans;
    var lines = [[]];
    for (var i = 0, num = 0, move = 0, accWidth = 0, len = chars.length; i < len; i++) {
      var code = chars[i].charCodeAt();
      var charWidth = parseFloat(spans[code].width);
      var hasNextChar = !!chars[i + 1];
      var nextCharWidth = hasNextChar ? parseFloat(spans[chars[i + 1].charCodeAt()].width) : 0;

      lines[num].push(chars[i]);

      if (accWidth < nodeWidth) {
        accWidth += charWidth;
      } else {
        if (move <= h.options.move && moveNextChar(node, i)) {
          move++;
          continue;
        } else {
          move = 0;
        }
        var dash = hypher(node, i);
        if (dash.length > 0) {
          lines[num].push(dash);
        }
        accWidth = 0;
        lines[++num] = [];
      }
    }
    return lines;
  }

  // calculate letter-spacing
  function calcLetterSpacing(node, lines) {
    var nodeWidth = node.nodeWidth;
    var spans = node.spans;
    var spaces = [];
    lines.forEach(function (line) {
      var lineSize = line.length;
      var charWidthArray = line.map(function (char) {
        return parseFloat(spans[char.charCodeAt()].width);
      });
      var lineWidth = charWidthArray.reduce(function (a, c) {
        return a + c;
      });
      spaces.push((nodeWidth - lineWidth) / lineSize);
    });
    return spaces;
  }

  // render each line to a div
  function renderLines(node, lines, spaces) {
    var lineNodes = [];
    var parent = node.node;
    parent.innerHTML = '';

    lines.forEach(function (line, index) {
      var isLastLine = index === lines.length - 1;
      lineNodes.push(createDiv(line.join(''), spaces[index], isLastLine));
    });

    lineNodes.forEach(function (node) {
      parent.appendChild(node);
    });

    function createDiv(text, space, isLastLine) {
      var div = document.createElement('div');
      // make sure each div to display block
      (0, _utils.style)(div, 'display', 'block');

      if (isLastLine === false) {
        (0, _utils.style)(div, 'letter-spacing', space + 'px');
      }

      div.innerText = text;
      return div;
    }
  }

  // auto hyphenation, this is a complicate part
  // I will make it simple
  function hypher(node, bIndex) {
    var text = node.node.innerText;
    var boarderChar = text[bIndex];
    var boarderNextChar = text[bIndex + 1] ? text[bIndex + 1] : '';
    if (excludeHyphenChar.indexOf(boarderChar) > -1 || excludeHyphenChar.indexOf(boarderNextChar) > -1 || boarderChar.charCodeAt() === 32 || boarderNextChar.charCodeAt() === 32) {
      return '';
    } else {
      return '-';
    }
  }

  // decide whether should move to next char or not
  function moveNextChar(node, bIndex) {
    var wordRe = /[a-zA-Z]/;
    var text = node.node.innerText;
    var leftMin = h.options.leftMin;
    var rightMin = h.options.rightMin;
    var move = false;

    function walkLeft(index) {
      if (!wordRe.test(text[index])) {
        move = true;
      }
    }

    function walkRight(index) {
      if (!wordRe.test(text[index])) {
        move = true;
      }
    }

    var l = 0,
        r = 0;
    while (l++ <= leftMin) {
      walkLeft(bIndex - l);
    }

    while (r++ <= rightMin) {
      walkRight(bIndex + r);
    }

    return move;
  }
}

function callAfterRender(h) {}

/***/ })
/******/ ]);