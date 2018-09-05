import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Project } from "./project.model";
import { ProjectService } from "./project.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import {catchError, finalize} from "rxjs/operators";
import {of} from "rxjs/observable/of";
import { Injectable } from "@angular/core";
import { ProjectData } from "./project.data.model";

@Injectable()
export class ProjectDataSource implements DataSource<Project> {

    public projectsSubject = new BehaviorSubject<Project[]>([]);
    result: ProjectData;
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalSubject = new BehaviorSubject<number>(0);
    public loading$ = this.loadingSubject.asObservable();
    public total$ = this.totalSubject.asObservable();

    constructor(private projectService: ProjectService) {}

    connect(collectionViewer: CollectionViewer): Observable<Project[]> {
        return this.projectsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.projectsSubject.complete();
        this.loadingSubject.complete();
        this.totalSubject.complete();
    }
  
    loadProjects(sortBy: string, filter: string,
                sortDirection: string, pageIndex: number, pageSize: number) {
        
        this.loadingSubject.next(true);
        this.totalSubject.next(0);
        
        this.projectService.loadProjects(sortBy, filter, sortDirection,
            pageIndex, pageSize).pipe(
            catchError(
                () => of([])
            ),
            finalize(
                () => this.loadingSubject.next(false)
            )
        )
        .subscribe(
            (projects: ProjectData) => {
                console.log(projects.data)
                this.projectsSubject.next(projects.data);
                this.totalSubject.next(projects.total);
                }
            );
        }
    }  