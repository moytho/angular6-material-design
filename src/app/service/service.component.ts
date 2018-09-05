import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ServiceDataSource } from './service.datasource';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ServiceService } from './service.service';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  dataSource: ServiceDataSource;
  displayedColumns= [ "actions","name","description", "one_time_fee", "monthly_fee"];
  pageSize:number = 10;
  selectedRowIndex: number = -1;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
    

  constructor( private router: Router, private serviceService: ServiceService) { }

  ngOnInit() {
      this.dataSource = new ServiceDataSource(this.serviceService);
      this.dataSource.loadServices("service_id", "", "desc", 1, this.pageSize);
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    

    fromEvent(this.input.nativeElement,'keyup')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;
                this.loadServicePage();
            })
        )
        .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadServicePage())
    )
    .subscribe();

}

highlight(row){
    //this.router.navigate(['/customer/'+ row.customer_id]);
  }

  loadServicePage() {
    this.dataSource.loadServices(
        this.sort.active,
        this.input.nativeElement.value,
        this.sort.direction,
        this.paginator.pageIndex + 1,
        this.paginator.pageSize);
}

}
