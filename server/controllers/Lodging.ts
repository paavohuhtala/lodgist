
import {Request, Response} from "express"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"
import {AddressDao} from "../database/daos/AddressDao"

async function getViewData(id: number) {
    const lodging = await new LodgingDao().getById(id)
    const address = await new AddressDao().getById(lodging.address)
    
    return {lodging: lodging, address: address}
}

export const Lodging : IController = {
    get: (req: Request, res: Response) => {
        let id = parseInt(req.params.id, 10);
        getViewData(id)
        .then(data => res.render("lodging", data), err => res.send(500, err));             
    }
}
