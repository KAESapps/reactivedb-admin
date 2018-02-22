const swap = require("uiks/reaks/swap")
const displayIf = require("uiks/reaks/displayIf")
const vPile = require("uiks/reaks/vPile")
const label = require("uiks/reaks/label")
const margin = require("uiks/reaks/margin")
const size = require("uiks/reaks/size")
const textColor = require("uiks/reaks/textColor")
const onKeyPress = require("uiks/reaks/onKeyPress")
const button = require("uiks/reaks-material/button")
const textInput = require("uiks/reaks-material/textInput")

const observableAsValue = require("uiks/core/observableAsValue")

module.exports = size(
  { w: 300 },
  onKeyPress(
    {
      keyCode: "Enter",
      action: ctx => ctx.command.trigger,
    },
    vPile([
      observableAsValue(
        "username",
        textInput({
          placeholder: "Utilisateur",
        })
      ),

      observableAsValue(
        "password",
        textInput({
          placeholder: "Mot de passe",
          password: true,
        })
      ),

      margin(
        { t: 15 },
        swap(ctx => () => {
          if (ctx.command.status() !== "waiting")
            return button("Connexion", ctx => ctx.command.trigger)
          if (ctx.command.status() === "waiting") return label("connexion...")
        })
      ),

      displayIf(
        ctx => () => ctx.command.status() === "error",
        textColor("red", label("Erreur de connexion"))
      ),
    ])
  )
)
