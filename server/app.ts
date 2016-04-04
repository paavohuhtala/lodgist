
import * as express from "express"

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

app.get("/lodgings", (req, res) => {
   res.render("lodgings", {lodgings: lodgings});
});

app.get("/lodging/:id", (req, res) => {
    let id = parseInt(req.params.id, 10) - 1;
    res.render("lodging", {lodging: lodgings[id]});
})

app.listen(8080, () => {
    console.log("hello");
});
