import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Customer } from "./customer.model";
import { CustomerService } from "./customer.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import {catchError, finalize} from "rxjs/operators";
import {of} from "rxjs/observable/of";
import { Injectable } from "@angular/core";
import { CustomerData } from "./customer.data.model";

@Injectable()
export class CustomerDataSource implements DataSource<Customer> {

    public customersSubject = new BehaviorSubject<Customer[]>([]);
    result: CustomerData;
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalSubject = new BehaviorSubject<number>(0);
    public loading$ = this.loadingSubject.asObservable();
    public total$ = this.totalSubject.asObservable();

    constructor(private customerService: CustomerService) {}

    connect(collectionViewer: CollectionViewer): Observable<Customer[]> {
        return this.customersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.customersSubject.complete();
        this.loadingSubject.complete();
        this.totalSubject.complete();
    }
  
    loadCustomers(sortBy: string, filter: string,
                sortDirection: string, pageIndex: number, pageSize: number) {
        
        this.loadingSubject.next(true);
        this.totalSubject.next(0);
        
        this.customerService.loadCustomers(sortBy, filter, sortDirection,
            pageIndex, pageSize).pipe(
            catchError(
                () => of([])
            ),
            finalize(
                () => this.loadingSubject.next(false)
            )
        )
        .subscribe(
            (customers: CustomerData) => {
                this.customersSubject.next(customers.data);
                this.totalSubject.next(customers.total);
                }
            );
        }
    }  