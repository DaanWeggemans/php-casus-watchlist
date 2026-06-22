import { DetailSerie } from "./serie";
import { User } from "./user";

export interface Feeds {
    id: string,
    serie: DetailSerie,
    user: User,
    shared_on: Date,
}