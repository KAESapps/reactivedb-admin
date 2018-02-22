# Exemple d'utilisation

dbAdmin.js :

```
const rdbAdmin = require("reactivedb-admin")
const config = {
    server: {
        host: "localhost",
        port: 3000,
        secure: false,
        url: "/server",
    },
}

rdbAdmin(config)
```

Puis ajouter un script NPM du type :

`"budo dbAdmin.js"`
