import { Customer } from "../customer/customer.model";
import { Service } from "../service/service.model";

export interface Project {
    project_id: number;
    name: string;
    description: string;
    observations: string;
    fee: number;
    term: string;
    start_date: string;
    start_date_object: any;
    end_date: string;
    end_date_object: any;
    customer_id: number;
    customer: Customer;
    service_id: number;
    service: Service
    active: boolean;
}