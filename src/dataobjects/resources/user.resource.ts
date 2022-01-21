export interface UserResource {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    verified: boolean;
    create_date: Date | null;
    update_date: Date | null;
}