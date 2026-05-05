const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { internalIpV4Sync } = require('internal-ip')   // import sync function directly
const portFinderSync = require('portfinder-sync')

const infoColor = (_message) =>
{
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer:
        {
            host: '0.0.0.0',
            port: portFinderSync.getPort(8080),
            static: './dist',
            hot: true,
            open: true,
            server: {
                type: 'http',
            },
            allowedHosts: 'all',
            client: {
                overlay: true,
            },
            setupMiddlewares: (middlewares, devServer) =>
            {
                const port = devServer.options.port
                const https = devServer.options.server.type === 'https' ? 's' : ''
                const localIp = internalIpV4Sync()      // call it directly
                const domain1 = `http${https}://${localIp}:${port}`
                const domain2 = `http${https}://localhost:${port}`
                
                console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`)
                
                return middlewares
            }
        }
    }
)
