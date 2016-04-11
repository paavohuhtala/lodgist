
import * as express from "express"
import * as Promise from "bluebird"
import * as Connection from "./database/Connection"
import {UserDao} from "./database/daos/UserDao" 

// For testing. will be moved to an env var.
const cons = "postgres://postgres:postgres@localhost:5432/lodgist";
Connection.initialize(cons);

let app = express()

app.use(express.static("app/static/"))

app.set("view engine", "jade");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

let lodgings = [
    {
        id: 1,
        owner: "Keijo",
        name: "Mockuppimökki 1",
        pricePerNight: 64,
        address: {
            city: "Kuopio"
        }},
    {
        id: 2,
        owner: "Heikki",
        name: "Mockuppimökki 2",
        pricePerNight: 666,
        address: {
            city: "Mettä"
        }},
    {
        id: 3,
        owner: "Mee pois",
        name: "Äääh 1.2",
        pricePerNight: 76,
        address: {
            city: "/_____\\"
        }
    }];

import {LodgingDao} from "./database/daos/LodgingDao"
import {ILodgingRow} from "./models/Lodging"

app.get("/lodgings", (req: express.Request, res: express.Response) => {
    new LodgingDao().getAll().then(rows => {
        res.render("lodgings", {lodgings: rows});
    });
});

app.get("/lodging/:id", (req, res) => {
    let id = parseInt(req.params.id, 10) - 1;
    new LodgingDao().getById(id).then(row => {
        res.render("lodging", {lodging: row});
    });
});

app.listen(8080, () => {
});
