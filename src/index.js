/**
 * hyphen.js
 * Develop by 1kg
 * use it to make the text align neatly.
 */

(function (root) {
    const utils = {
        extend: function (from, to) {
            for (let prop in to) from[prop] = to[prop];
            return from;
        },
        attr(node, name, value) {
            if (value === undefined) {
                return node.getAttribute(name);
            } else {
                return node.setAttribute(name, value);
            }
        }
    };

    const SPACE = 32;
    const specialSymbol = '\"\':;,.?()[]{}<>~!@#$%^&*-+=/\\|1234567890'.split('');
    const mark = 'hyphen-time';
    const charCodes = specialSymbol.map(s => s.charCodeAt()).concat([SPACE]);
    const cache = Object.create(null);

    class Hyphen {
        constructor(conf) {
            this.initBaseCfg(conf);
            this.initCache();
            this.initBaseData();
        }

        initBaseCfg(conf) {
            const $conf = {
                parent: document.body,
                selector: 'p',
                neat: true,
                nodes: null
            };

            if (typeof conf === 'string') {
                $conf.selector = conf;
            } else {
                utils.extend($conf, conf);
            }

            const nodes = $conf.nodes;
            const slice = Array.prototype.slice;

            // nodes and selector are mutually exclusive.
            // if nodes exist, then hyphen will not use selector.
            if (nodes) {
                // make nodes always an array
                if (nodes.length) {
                    $conf.nodes = slice.call(nodes);
                } else {
                    $conf.nodes = [nodes];
                }
            } else {
                $conf.nodes = slice.call(
                    $conf.parent.querySelectorAll($conf.selector)
                );
            }

            this.$conf = $conf;
        }
        // init hyphen cache. Set node attribute `hyphen` to mark whether hyphen or not. 
        // To prevent repeatly hyphen the same node.
        initCache() {
            const nodes = this.$conf.nodes;
            nodes.forEach(node => {
                const time = utils.attr(node, mark);
                if (time === undefined || time === null) {
                    utils.attr(node, mark, '1');
                }
            });
        }

        initBaseData() {
            const nodes = this.$conf.nodes;
            nodes.forEach(node => {
                this.parseNode(node);
            });
        }

        renderNode() {

        }

        // parse node to get the text data.
        parseNode(node) {
            const nodeTree = Object.create(null);
            const TYPE = {
                '1': 'ELEMENT_NODE',
                '3': 'TEXT_NODE'
            };
            walkNode(node);

            // build a node tree base on childNodes nodeType. 
            // Node.ELEMENT_NODE => 1
            // Node.TEXT_NODE => 3
            function walkNode(node) {
                const nodes = node.childNodes;
                const nodesLen = nodes.length;
            
            }
            console.log(nodeTree);
        }
    }

    root.hyphen = conf => new Hyphen(conf);
}(window));