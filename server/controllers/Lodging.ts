
import {Response} from "express"
import {RequestEx} from "../RequestEx"
import {IController} from "../IController"
import {getClient} from "../database/Connection"
import {LodgingDao} from "../database/daos/LodgingDao"
import {AddressDao} from "../database/daos/AddressDao"
import {UserDao} from "../database/daos/UserDao"
import {LodgingAmenityDao} from "../database/daos/LodgingAmenityDao"

async function getViewData(id: number, userId?: number) {
    return getClient().task(async (t) => {
        const lodging = await new LodgingDao(t).getById(id);
        const address = await new AddressDao(t).getById(lodging.address);
        const owner = await new UserDao(t).getById(lodging.owner);
        const amenities = await new LodgingAmenityDao(t).getByLodging(lodging.id);
        const isOwner = owner.id == userId;
    
        return { lodging, address, owner, amenities, isOwner }
    });
}

export const Lodging : IController = {
    get: async (req: RequestEx, res: Response) => {
        let id = parseInt(req.params.id, 10);
        let viewData = await getViewData(id, req.user.id);
        res.render("lodging", viewData);
    }
}

export const NewLodging : IController = {
    get: (req: RequestEx, res: Response) => {
        res.render("new_lodging");
    }
}