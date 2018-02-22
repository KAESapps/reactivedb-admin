const reactivedbClient = require("reactivedb/client")
const assign = require("lodash/assign")

module.exports = ({ config, user, password }) => {
  const { secure, host, port, url } = config.server
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(
      `ws${secure ? "s" : ""}://${host}:${port}?name=${user}&pass=${password}`
    )
    ws.addEventListener("open", () => {
      console.log("connected to server")
      resolve(
        assign(
          {
            onDisconnect: cb => ws.addEventListener("close", cb),
          },
          reactivedbClient(ws)
        )
      )
    })
    ws.addEventListener("error", reject)
  })
}
