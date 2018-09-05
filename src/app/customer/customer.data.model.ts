import { Customer } from "./customer.model";

export interface CustomerData {
    current_page:number;
    data:Customer[];
    from:number;
    last_page:number;
    next_page_url: string;
    path:string;
    per_page:number;
    prev_page_url:string;
    to: number;
    total:number;
    }