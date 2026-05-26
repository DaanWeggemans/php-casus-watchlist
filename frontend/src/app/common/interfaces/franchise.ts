export interface CreateFranchiseRequest {
    name: string;
}

export interface EditFranchiseRequest {
    name?: string;
    index?: number;
}

export interface Franchise {
    id: string;
    name: string;
    index: number;
}