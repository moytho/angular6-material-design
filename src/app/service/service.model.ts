export interface Service {
    service_id?: number;
    name: string;
    description: string;
    monthly_fee: number;
    one_time_fee: number;
    active: boolean;
}