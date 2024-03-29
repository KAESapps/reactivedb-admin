const reactivedbClient = require("reactivedb/client")
const reactivedbClientRaw = require("reactivedb/client-raw-ws")
const assign = require("lodash/assign")

module.exports = ({ config, username, password }) => {
  const { secure, host, port, url } = config.server
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(
      `ws${secure ? "s" : ""}://${host}:${port}?name=${encodeURIComponent(
        username
      )}&pass=${encodeURIComponent(password)}`
    )
    ws.addEventListener("open", () => {
      console.log("connected to server")
      resolve(
        assign(
          {
            onDisconnect: (cb) => ws.addEventListener("close", cb),
          },
          reactivedbClient(reactivedbClientRaw(ws))
        )
      )
    })
    ws.addEventListener("error", reject)
  })
}
