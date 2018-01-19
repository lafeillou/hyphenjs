const exec = require('child_process').exec;
const chokidar = require('chokidar');
const path = require('path');
const devPath = path.resolve(__dirname, 'src');

// prevent exec `npm run build` when add file first time.
let preventExec = true;

// watch src file change to auto build.
const watcher = chokidar.watch(devPath, {
    ignored: /node_modules|\.git|dist/
}).on('all', (event, path) => {
    if (preventExec) return;
    log(event, path, 'start build');
    exec('npm run build', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        log(blue('build in dist'));
    });
}).on('ready', () => {
    preventExec = false;
    log('begin to watch');
});

function log(...args) {
    console.log(blue('(Dev-watch): ') + args.join(' '));
}

function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}