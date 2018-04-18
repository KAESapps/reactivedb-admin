const materialRoot = require("uiks/reaks-material/root")
const renderFullscreen = require("uiks/reaks/renderFullscreen")
const swap = require("uiks/reaks/swap")
const align = require("uiks/reaks/align")
const scroll = require("uiks/reaks/scroll")
const command = require("uiks/core/command")
const json5 = require("json5")
const formatJson = require("format-json").plain
const rdbClient = require("./rdbClient")
const ctxAssign = require("uiks/core/assign")
const assignObservable = require("uiks/core/assignObservable")
const assignCtx = require("uiks/core/assign")

const loginForm = require("./loginForm")

const materialColors = require("material-colors")

const colors = {
  primary: materialColors.yellow[500],
  textOnPrimary: "black",
  fadedTextOnPrimary: materialColors.brown[500],
  secondary: materialColors.grey[900],
  textOnSecondary: materialColors.white,
  darkText: "black",
  fadedDarkText: materialColors.grey[600],
}

const vFlex = require("uiks/reaks/vFlex")
const hPile = require("uiks/reaks/hPile")
const backgroundColor = require("uiks/reaks/backgroundColor")
const value = require("uiks/core/value")
const formatValue = require("uiks/core/formatValue")
const dynamicQuery = require("uiks/reactivedb/dynamicQuery")
const displayIf = require("uiks/reaks/displayIf")
const loadingSwitch = require("uiks/reaks/loadingSwitch")
const button = require("uiks/reaks-material/button")
const commandButton = require("uiks/reaks-material/commandButton")
const label = require("uiks/reaks/label")
const size = require("uiks/reaks/size")

var ace = require("brace")
require("brace/mode/javascript")

const child = require("reaks/child")
const text = require("reaks/text")

const jsEditor = ctx => {
  return domNode => {
    var editor = ace.edit(domNode)
    editor.getSession().setMode("ace/mode/javascript")
    editor.setFontSize(16)
    editor.setValue(ctx.queryEditorValue)
    editor.on("change", () => {
      ctx.queryEditorValue = editor.getValue()
      localStorage.setItem("lastReactiveDbAdminQuery", ctx.queryEditorValue)
    })
    return () => editor.destroy()
  }
}

const codeDisplayer = ctx =>
  child(text(ctx.value), () => document.createElement("pre"))

const app = assignCtx(
  {
    queryEditorValue:
      localStorage.getItem("lastReactiveDbAdminQuery") || "[{}]",
  },
  assignObservable(
    {
      validatedQuery: null,
    },
    vFlex([
      ["fixed", size({ h: 300 }, jsEditor)],
      [
        "fixed",
        backgroundColor(
          "#EEE",
          hPile([
            button("Exécuter la requête", ctx => () => {
              ctx.validatedQuery(json5.parse(ctx.queryEditorValue))
            }),
            commandButton("Exécuter comme patch", ctx => () =>
              ctx.patch(json5.parse(ctx.queryEditorValue))
            ),
          ])
        ),
      ],
      displayIf(
        "validatedQuery",
        value(
          dynamicQuery(ctx => ctx.validatedQuery()),

          loadingSwitch({
            loaded: scroll(formatValue(formatJson, codeDisplayer)),
            loading: label("chargement ..."),
          })
        )
      ),
    ])
  )
)

const login = config =>
  command(
    ctx => () =>
      rdbClient({
        config,
        user: ctx.username(),
        password: ctx.password(),
      }),
    ctxAssign(
      ctx => {
        // dev!!
        if (process.env.NODE_ENV === "dev") {
          ctx.username("admin")
          ctx.password("admin")
          ctx.command.trigger()
        }
      },
      swap(ctx => () => {
        if (ctx.command.status() === "success") {
          return ctxAssign(ctx.command.result, app)
        } else {
          return align({ v: "center", h: "center" }, loginForm)
        }
      })
    )
  )

module.exports = config =>
  renderFullscreen(
    materialRoot(
      { getFileUrl: () => filename => "assets/" + filename },
      assignObservable(
        {
          username: "",
          password: "",
        },
        login(config)
      )
    )
  )({ colors })
