
import {RequestHandler} from "express"

export interface IController {
    get?: RequestHandler
    post?: RequestHandler
    delete?: RequestHandler
    put?: RequestHandler
}
