/**
 * hyphen.js
 * Develop by 1kg
 * use it to make the text align neatly.
 */
import Subject from './subject';
import * as utils from './utils';

const SPACE = 32;
const sym = '\"\':;,.?()[]{}<>~!@#$%^&*-+=/\\|1234567890'.split('');
const mark = 'hyphen-time';
const codes = sym.map(s => s.charCodeAt()).concat([SPACE]);
const cache = Object.create(null);
const slice = Array.prototype.slice;

class Core {
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
          
        });
    }

    renderNode() {

    }
}

export function render(conf) {
    new Core(conf);
};