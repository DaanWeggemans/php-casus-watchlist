export interface CreateEpisodeRequest {
    serie_id: string;
    episodes: {
        name: string | null;
    }[];
}