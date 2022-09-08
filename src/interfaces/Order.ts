import { Product } from "./Product";

export interface Order {
    id?: number;
    order_id?: number;
    user_id?: number;
    status?: OrderStatus;
    total?: number;
    products: OrderItem[];
}

export type OrderStatus = "open" | "close";

export interface OrderItem {
    id?: number;
    quantity: number;
}
