
import {Request, Response} from "express"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"
import {AddressDao} from "../database/daos/AddressDao"
import {UserDao} from "../database/daos/UserDao"

async function getViewData(id: number) {
    const lodging = await new LodgingDao().getById(id);
    const address = await new AddressDao().getById(lodging.address);
    const owner = await new UserDao().getById(lodging.owner);
    
    return {lodging: lodging, address: address, owner: owner}
}

export const Lodging : IController = {
    get: async (req: Request, res: Response) => {
        let id = parseInt(req.params.id, 10);
        let viewData = await getViewData(id);
        res.render("lodging", viewData);
    }
}

export const NewLodging : IController = {
    get: (req: Request, res: Response) => {
        res.render("new_lodging");
    }
}