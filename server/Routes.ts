import {Express} from "express"

import {Index} from "./controllers/Index"
import {Login} from "./controllers/Login"
import {Register} from "./controllers/Register"
import {Lodging} from "./controllers/Lodging"
import {Lodgings} from "./controllers/Lodgings"

export function registerRoutes(app: Express) {
    app.get("/", Index.get);

    app.get("/login", Login.get);
    app.get("/register", Register.get);
    
    app.get("/lodgings", Lodgings.get);
    app.get("/lodgings/:id", Lodging.get);
}