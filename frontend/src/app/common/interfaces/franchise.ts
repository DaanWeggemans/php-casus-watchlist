export interface FranchiseBody {
    name: string;
}

export interface FranchiseEditBody {
    name?: string;
    index?: number;
}

export interface Franchise {
    id: string;
    name: string;
    index: number;
}