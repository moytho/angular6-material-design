import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CustomerDataSource } from './customer.datasource';
import { CustomerService } from './customer.service';
import { MatSort, MatPaginator } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  dataSource: CustomerDataSource;
  displayedColumns= [ "actions","name","company", "email", "phone"];
  pageSize:number = 10;
  selectedRowIndex: number = -1;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
    

  constructor( private router: Router, private customerService: CustomerService) { }

  ngOnInit() {
      this.dataSource = new CustomerDataSource(this.customerService);
      this.dataSource.loadCustomers("customer_id", "", "desc", 1, this.pageSize);
  }

  highlight(row){
    //this.router.navigate(['/customer/'+ row.customer_id]);
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    

    fromEvent(this.input.nativeElement,'keyup')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;
                this.loadCustomerPage();
            })
        )
        .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadCustomerPage())
    )
    .subscribe();

}


  loadCustomerPage() {
    this.dataSource.loadCustomers(
        this.sort.active,
        this.input.nativeElement.value,
        this.sort.direction,
        this.paginator.pageIndex + 1,
        this.paginator.pageSize);
}

}