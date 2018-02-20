const path = require('path')
const exec = require('child_process').exec
const srcPath = path.resolve(__dirname, 'src')
const bs = require('browser-sync').create('dev-watch')

bs.watch('./index.html').on('change', bs.reload)
bs.watch(srcPath).on('change', () => {
    bs.notify("Compiling, please wait!")
    exec('webpack --config ./webpack.dev.conf.js', (error, stdout, stderr) => {
        if (error) return;
        bs.reload()
        bs.notify("Built in dist.")
    })
})

bs.init({
    server: true
})
