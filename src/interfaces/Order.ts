import { Product } from "./Product";

export interface Order {
    id?: number;
    user_id?: number;
    status?: OrderStatus;
    total?: number;
}

export type OrderStatus = "open" | "close";

export interface OrderItem {
    product: Product;
    qunatity: number;
}
