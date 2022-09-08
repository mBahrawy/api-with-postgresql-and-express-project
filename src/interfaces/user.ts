export type userRole = "regular" | "admin" | "super_admin";

export enum USER_ROLES_ENUM {
    "regular",
    "admin",
    "super_admin"
}

export const USER_ROLES_ARR = [...Object.values(USER_ROLES_ENUM)];

export interface User {
    id?: Number;
    username: string;
    firstname: string;
    lastname: string;
    email: String;
    password?: String;
    token?: string;
    role: userRole;
}
