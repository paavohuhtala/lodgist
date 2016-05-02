
import {IUser} from "./User"
import {ILodging} from "./Lodging"

export interface IBaseReview {
    id?: number,
    is_public?: boolean,
    content: string,
    rating: number
}

export interface IReviewRow extends IBaseReview {
    author: number,
    lodging: number    
}

export interface IReview extends IBaseReview {
    author: IUser,
    lodging: ILodging
}

export module Review {
    export const columns = ["id", "is_public", "content", "rating", "author", "lodging"]
}
