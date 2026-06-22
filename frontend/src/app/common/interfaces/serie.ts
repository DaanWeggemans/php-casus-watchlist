import { Episode } from "./episode";

export interface CreateSerieRequest {
    name: string;
    type: string;
    done: boolean;
    season: number | null;
    image: File | null,
    franchise_id: string;
}

export interface EditSerieRequest {
    name?: string;
    index?: number;
    done?: boolean;
    season?: number;
    image?: File | null;
    franchise_id?: string;
}

export interface Serie {
    id: string;
    name: string;
    type: string;
    done: boolean;
    season: number | null;
    image: string | null;
    index: number;
}

export interface DetailSerie extends Serie {
    episodes: Episode[]
}