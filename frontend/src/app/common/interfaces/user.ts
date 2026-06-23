export interface User {
    id: string;
    username: string;
    email: string;
}

export interface FollowedUser extends User {
    is_followed: boolean;
}