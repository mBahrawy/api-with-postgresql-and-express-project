import { User } from "../user";

export interface LoginRespond {
    user?: User | null;
    error?: string;
    status: number;
}
