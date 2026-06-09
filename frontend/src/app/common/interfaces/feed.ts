import { Serie } from "./serie";
import { User } from "./user";

export interface Feeds {
    id: string,
    serie: Serie,
    user: User
}