const express = require("express")
const bodyParser = require("body-parser")
const http = require("http")
const redisUtils = require("./redisUtils")

const {name, description, version} = require("../package.json")
const {getNodesRouter} = require("./nodesRouter")
const {getProxyRouter} = require("./proxyRouter")

const {PORT = 8000} = process.env

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.all("/info", (request, response) => {
    response.json({name, description, version})
})

Promise
    .all([
        redisUtils.createClient({host: "redis"})
    ])
    .then(([redisClient]) =>
    {
        app.use("/nodes", getNodesRouter(redisClient))
        app.use(getProxyRouter(redisClient))

        http.createServer(app)
            .listen(PORT, () => {
                console.log(`The server is listening on port: ${PORT}...`)
            })
    })


