import { DetailSerie } from "./serie";
import { FollowedUser } from "./user";

export interface Feeds {
    id: string,
    serie: DetailSerie,
    user: FollowedUser,
    shared_on: Date,
}