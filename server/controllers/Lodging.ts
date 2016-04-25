
import {Request, Response} from "express"
import {IController} from "../IController"
import {getClient} from "../database/Connection"
import {LodgingDao} from "../database/daos/LodgingDao"
import {AddressDao} from "../database/daos/AddressDao"
import {UserDao} from "../database/daos/UserDao"
import {LodgingAmenityDao} from "../database/daos/LodgingAmenityDao"

async function getViewData(id: number) {
    return getClient().task(async (t) => {
        const lodging = await new LodgingDao(t).getById(id);
        const address = await new AddressDao(t).getById(lodging.address);
        const owner = await new UserDao(t).getById(lodging.owner);
        const amenities = await new LodgingAmenityDao(t).getByLodging(lodging.id);
    
        return {lodging: lodging, address: address, owner: owner, amenities: amenities}
    });
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