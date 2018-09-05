import { Project } from "./project.model";

export interface ProjectData {
    current_page:number;
    data:Project[];
    from:number;
    last_page:number;
    next_page_url: string;
    path:string;
    per_page:number;
    prev_page_url:string;
    to: number;
    total:number;
}