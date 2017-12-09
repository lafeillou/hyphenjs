/**
 * 文本齐头尾
 */

(function (root) {
    var utils = {
        extend: function(from, to) {
            for(var prop in to) from[prop] = to[prop];
            return from;
        },
        // 生成唯一id
        idFactory: function(prefix, text) {
            return prefix + '_' + text.split('').map(function(c){
                return c.charCodeAt();
            }).join('');
        }
    };

    function hyphen(conf) {
        if(!(this instanceof hyphen)) return new hyphen(conf);
        var conf = conf || {};
        var _conf = {
            selector: 'p',
            deep: true,
            prefix: 'hyphen',
            markSymbol: '\"\':;,.?()[]{}<>~!@#$%^&*-+=/\\|1234567890'
        };
        this.$conf = utils.extend(_conf, conf);
        this.init();
    }

    hyphen.prototype = {
        constructor: hyphen,
        init: function() {
            var conf = this.$conf;
            this.$id = utils.idFactory(conf.prefix, conf.selector);
            this.$cached = Object.create(null);
            this.$markset = conf.markSymbol.split('').map(function(c) {
                return c.charCodeAt();
            }).concat([32]);
        }
    };

    root.hyphen = hyphen;
})(this);