import { Service } from "./service.model";

export interface ServiceData {
    current_page:number;
    data:Service[];
    from:number;
    last_page:number;
    next_page_url: string;
    path:string;
    per_page:number;
    prev_page_url:string;
    to: number;
    total:number;
}