import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Project } from './project.model';
import { HandleError, HttpErrorHandler } from '../http-error-handler.service';
import { ProjectData } from './project.data.model';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Utils from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl: string;
  private handleError: HandleError;
  
  constructor(private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) { 
    
      this.handleError = httpErrorHandler.createHandleError('ProjectService');
      this.baseUrl = Utils.getUrlAPI();
  }

  loadProjects(
    sortBy:string, filter = '', sortDirection = 'asc',
    pageNumber = 0, pageSize = 10):  Observable<ProjectData> {
  
      return this.http.get(this.baseUrl + '/projects', {
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

  getProjects(sortBy: number, filter: string,
    sortDirection: string, pageIndex: number, pageSize: number) {
    return this.http.get(this.baseUrl + '/projects');
  }

  getProject(id:number): Observable<Project> {
    return this.http.get(this.baseUrl + '/projects/' + id)
    .pipe(
      map(res => { 
        res['payload'] = res;
        return res["payload"]; })
    );
    
  }

  saveProject (project: Project): Observable<Project> {

    return this.http.post<Project>(this.baseUrl + '/projects', project)
      .pipe(
        catchError(this.handleError('addProject', project))
      );
  }

  updateProject (project: Project): Observable<Project> {
    return this.http.put<Project>(this.baseUrl + '/projects/' + project.project_id, project)
    .pipe(
      catchError(this.handleError('updateProject', project))
    );
  }

  deleteProject(id:number) {
    return this.http.delete(this.baseUrl + '/projects/' + id);
  }
  
}
