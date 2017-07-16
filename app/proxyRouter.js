const {Router} = require("express")
const httpProxy = require("http-proxy")
const httpStatusCodes = require("http-status-codes")
const {getNodes} = require("./configService")

const getRandom = limit => Math.floor(Math.random() * limit)

const getRandomUrl = urls => urls[getRandom(urls.length)]

const getProxyRouter = redisClient =>
{
    const proxyRouter = Router()
    const proxy = httpProxy.createProxyServer({})

    proxyRouter.use((request, response) => {
        getNodes(redisClient)
            .then(nodes => {
                const urls = nodes.map(({url}) => url)

                if(urls.length === 0) {
                    response
                        .status(httpStatusCodes.SERVICE_UNAVAILABLE)
                        .json({errorMessage: "Service NOT available"})
                } else {
                    proxy.web(request, response, {target: getRandomUrl(urls)})
                }
            })
    })

    return proxyRouter
}

module.exports = {
    getProxyRouter
}