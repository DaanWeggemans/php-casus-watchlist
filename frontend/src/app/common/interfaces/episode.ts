export interface CreateEpisodeRequest {
    serie_id: string;
    episodes: {
        name: string | null;
    }[];
}

export interface EditEpisodeRequest {
    name?: string;
    index?: number;
    serie_id?: string;
}