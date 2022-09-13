import { Review } from "./Review";

export interface Order {
    id?: number;
    order_id?: number;
    user_id?: number;
    status?: OrderStatus;
    total?: number;
    products?: OrderItem[] | [];
    review?: Review | null;
}

export type OrderStatus = "open" | "close" | "completed";

export interface OrderItem {
    id?: number;
    quantity: number;
}
