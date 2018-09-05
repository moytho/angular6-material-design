import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProjectDataSource } from './project.datasource';
import { MatPaginator, MatSort } from '@angular/material';
import { ProjectService } from './project.service';
import { Router } from '@angular/router';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  dataSource: ProjectDataSource;
  displayedColumns= [ "actions","name","service", "customer", "fee", "term"];
  pageSize:number = 10;
  selectedRowIndex: number = -1;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
    

  constructor( private router: Router, private projectService: ProjectService) { }

  ngOnInit() {
      this.dataSource = new ProjectDataSource(this.projectService);
      this.dataSource.loadProjects("project_id", "", "desc", 1, this.pageSize);
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    

    fromEvent(this.input.nativeElement,'keyup')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;
                this.loadProjectPage();
            })
        )
        .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadProjectPage())
    )
    .subscribe();

}


  loadProjectPage() {
    this.dataSource.loadProjects(
        this.sort.active,
        this.input.nativeElement.value,
        this.sort.direction,
        this.paginator.pageIndex + 1,
        this.paginator.pageSize);
}

}
