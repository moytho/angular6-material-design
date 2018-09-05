import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Service } from './service.model';
import { Observable } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { Data } from '../shared/data.model';
import { ServiceData } from './service.data.model';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import Utils from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  baseUrl: string;
  private handleError: HandleError;
  
  constructor(private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) { 
    
      this.handleError = httpErrorHandler.createHandleError('ServiceService');
      this.baseUrl = Utils.getUrlAPI();
  }

  loadServices(
    sortBy:string, filter = '', sortDirection = 'asc',
    pageNumber = 0, pageSize = 10):  Observable<ServiceData> {
  
      return this.http.get(this.baseUrl + '/services', {
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

  getService(id:number): Observable<Service> {
    return this.http.get(this.baseUrl + '/services/' + id)
    .pipe(
      map(res => { 
        res['payload'] = res;
        return res["payload"]; })
    );
    
  }

  saveService (service: Service): Observable<Service> {

    return this.http.post<Service>(this.baseUrl + '/services', service)
      .pipe(
        catchError(this.handleError('addService', service))
      );
  }

  updateService (service: Service): Observable<Service> {
    return this.http.put<Service>(this.baseUrl + '/services/' + service.service_id, service)
    .pipe(
      catchError(this.handleError('addService', service))
    );
  }

  deleteService(id:number) {
    return this.http.delete(this.baseUrl + '/services/' + id);
  }

}
