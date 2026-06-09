export interface CreateEpisodeRequest {
    serie_id: string;
    episodes: {
        name: string | null;
    }[];
}

export interface EditEpisodeRequest {
    name?: string;
    done?: boolean;
    index?: number;
    serie_id?: string;
}

export interface Episode {
    id: string;
    name: string | null;
    done: boolean;
    index: number;
}