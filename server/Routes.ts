import {Express} from "express"

import {Index} from "./controllers/Index"
import {Login} from "./controllers/Login"
import {Register} from "./controllers/Register"
import {Lodging, NewLodging} from "./controllers/Lodging"
import {Lodgings} from "./controllers/Lodgings"

import {LoginApi, LogoutApi} from "./controllers/api/Login"
import {NewLodgingApi} from "./controllers/api/NewLodging"

export function registerRoutes(app: Express) {
    app.get("/", Index.get);

    app.get("/login", Login.get);
    app.get("/register", Register.get);
    
    app.get("/lodgings", Lodgings.get);
    app.get("/lodgings/new", NewLodging.get);
    app.get("/lodgings/:id", Lodging.get);
    
    app.post("/api/v1/login", LoginApi.post);
    app.post("/api/v1/logout", LogoutApi.post);
    
    app.post("/api/v1/lodgings/new", NewLodgingApi.post);
}