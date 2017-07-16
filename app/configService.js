const axios = require("axios")
const {getValue, setValue} = require("./redisUtils")

const NODES_KEY = "nodes"

const upsertNode = (redisClient, nodeDetails) =>
    getNodes(redisClient)
        .then(nodes => setValue(redisClient)(NODES_KEY, nodes.concat(nodeDetails)))

const getNodes = redisClient =>
    getValue(redisClient)(NODES_KEY)
        .then(results => results === null ? [] : results)

const verifyNode = node =>
    axios.get(`${node.url}/app-info`)
        .then(() =>
        {
            console.log(`${node.url} is online`)

            return {isOnline: true, node}
        })
        .catch(error =>
        {
            console.warn(`${node.url} is NOT online`)

            return {
                isOnline: false, error, node
            }
        })

const verifyNodes = redisClient =>
    getNodes(redisClient)
        .then(nodes => Promise.all(nodes.map(verifyNode)))
        .then(results => results.filter(({isOnline}) => isOnline))
        .then(onlineNodes => onlineNodes.map(({node}) => node))

const setNodes = redisClient => nodeDetails => setValue(redisClient)(NODES_KEY, nodeDetails)

module.exports = {
    upsertNode,
    getNodes,
    verifyNodes,
    setNodes
}