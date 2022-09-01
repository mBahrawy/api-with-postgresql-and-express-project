export type userRole = "regular" | "admin" | "super_admin";

export interface User {
    id?: Number;
    name: string;
    username: string;
    email: String;
    password?: String;
    token?: string;
    role: userRole;
}
