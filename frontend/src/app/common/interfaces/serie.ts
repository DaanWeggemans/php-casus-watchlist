export interface CreateSerieRequest {
    name: string;
    type: string;
    done: boolean;
    season: number | null;
    image: File | null,
    franchise_id: string;
}