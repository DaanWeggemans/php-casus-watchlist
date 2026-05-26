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
    done?: boolean;
    season?: number;
    image?: File | null
}