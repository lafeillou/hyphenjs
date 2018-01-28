const path = require('path')
const exec = require('child_process').exec
const srcPath = path.resolve(__dirname, 'src')
const bs = require('browser-sync').create('dev-watch')

log('Start watching...')

bs.watch('./index.html').on('change', bs.reload)
bs.watch(srcPath).on('change', () => {
    log('Start building...')
    bs.notify("Compiling, please wait!")
    exec('npm run build', (error, stdout, stderr) => {
        if (error) return;
        log('Built in dist.')
        bs.reload()
        bs.notify("Built in dist.")
    })
})

bs.init({
    server: true
})

function log(...args) {
    console.log(blue('(Dev-watch): ') + args.join(' '))
}

function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
