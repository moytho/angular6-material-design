import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Service } from "./service.model";
import { ServiceService } from "./service.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import {catchError, finalize} from "rxjs/operators";
import {of} from "rxjs/observable/of";
import { Injectable } from "@angular/core";
import { ServiceData } from "./service.data.model";

@Injectable()
export class ServiceDataSource implements DataSource<Service> {

    public servicesSubject = new BehaviorSubject<Service[]>([]);
    result: ServiceData;
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalSubject = new BehaviorSubject<number>(0);
    public loading$ = this.loadingSubject.asObservable();
    public total$ = this.totalSubject.asObservable();

    constructor(private serviceService: ServiceService) {}

    connect(collectionViewer: CollectionViewer): Observable<Service[]> {
        return this.servicesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.servicesSubject.complete();
        this.loadingSubject.complete();
        this.totalSubject.complete();
    }
  
    loadServices(sortBy: string, filter: string,
                sortDirection: string, pageIndex: number, pageSize: number) {
        
        this.loadingSubject.next(true);
        this.totalSubject.next(0);
        
        this.serviceService.loadServices(sortBy, filter, sortDirection,
            pageIndex, pageSize).pipe(
            catchError(
                () => of([])
            ),
            finalize(
                () => this.loadingSubject.next(false)
            )
        )
        .subscribe(
            (services: ServiceData) => {
                this.servicesSubject.next(services.data);
                this.totalSubject.next(services.total);
                }
            );
        }
    }  