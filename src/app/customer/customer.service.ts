import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Customer } from './customer.model';
import { Observable } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { Data } from '../shared/data.model';
import { CustomerData } from './customer.data.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import Utils from '../shared/utils';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  
  baseUrl: string;
  private handleError: HandleError;
  
  constructor(private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) { 
    
      this.handleError = httpErrorHandler.createHandleError('CustomerService');
      this.baseUrl = Utils.getUrlAPI();

  }

loadCustomers(
  sortBy:string, filter = '', sortDirection = 'asc',
  pageNumber = 0, pageSize = 10):  Observable<CustomerData> {

    return this.http.get(this.baseUrl + '/customers', {
      params: new HttpParams()
          .set('sortBy', sortBy)
          .set('filter', filter)
          .set('sort', sortDirection)
          .set('page', pageNumber.toString())
          .set('pageSize', pageSize.toString())
  }).pipe(
    map(res => { 
      res['payload'] = res;
      return res["payload"]; })
  );
}

  getCustomer(id:number): Observable<Customer> {
    return this.http.get(this.baseUrl + '/customers/' + id)
    .pipe(
      map(res => { 
        res['payload'] = res;
        return res["payload"]; })
    );
    
  }

  saveCustomer (customer: Customer): Observable<Customer> {

    return this.http.post<Customer>(this.baseUrl + '/customers', customer, httpOptions)
      .pipe(
        catchError(this.handleError('addService', customer))
      );
  }

  updateCustomer (customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(this.baseUrl + '/customers/' + customer.customer_id, customer, httpOptions)
    .pipe(
      catchError(this.handleError('addService', customer))
    );
  }

  deleteCustomer(id:number) {
    return this.http.delete(this.baseUrl + '/customers/' + id);
  }

}

