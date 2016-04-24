
import * as express from "express"
import * as Promise from "bluebird"
import * as cookieParser from "cookie-parser"
import * as compression from "compression"
import * as moment from "moment"
const bodyParser = require("body-parser");

moment.locale("fi");

import * as Connection from "./database/Connection"

// For testing. will be moved to an env var.
const cons = "postgres://postgres:postgres@localhost:5432/lodgist";
Connection.initialize(cons);

const port = 8080

let app = express()
app.use(compression());
app.locals = {moment: require("moment"), _: require("lodash")};
app.set("view engine", "jade");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("./app/static/"))

import {attachSession, attachUser} from "./authentication/Middleware"

app.use(attachSession);
app.use(attachUser);

import {registerRoutes} from "./Routes"

registerRoutes(app);

app.listen(port, () => {
    console.log(`Now listening on ${port}`)
});
