
import * as express from "express"
import * as Promise from "bluebird"
import * as Connection from "./database/Connection"

import {registerRoutes} from "./Routes"

// For testing. will be moved to an env var.
const cons = "postgres://postgres:postgres@localhost:5432/lodgist";
Connection.initialize(cons);

const port = 8080

let app = express()

app.use(express.static("app/static/"))

app.set("view engine", "jade");

registerRoutes(app);

app.listen(port, () => {
    console.log(`Now listening on ${port}`)
});
