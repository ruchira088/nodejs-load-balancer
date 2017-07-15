const {Router} = require("express")
const {upsertNode, getNodes, verifyNodes, setNodes} = require("./configService")

const getNodesRouter = redisClient =>
{
    const nodesRouter = Router()

    setInterval(() => {
        verifyNodes(redisClient)
            .then(setNodes(redisClient))
    }, 1000)


    nodesRouter.get("/", (request, response) =>
    {
        getNodes(redisClient)
            .then(results => {
                response.json({results})
            })
    })

    nodesRouter.post("/", (request, response) =>
    {
        const {id, serviceName, url, version} = request.body

        upsertNode(redisClient, {id, url, version})
            .then(result => {
                response.json({result})
            })
    })

    return nodesRouter
}

module.exports = {
    getNodesRouter
}