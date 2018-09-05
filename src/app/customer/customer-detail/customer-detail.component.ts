import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';
import { UIService } from '../../shared/ui.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PhotoService } from '../customer.photo.service';
import { MatDialog } from '@angular/material';
import { RemoveElementComponent } from '../../shared/remove-record.component';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  isLoading = false;
  private loadingSubs: Subscription;
  title: string = "New Customer";
  edit: boolean = false;
  customer: Customer = {
    address: "",
    address2: "",
    billed_date: "",
    billed_date_object: null,
    company: "",
    customer_id: null,
    email: "",
    email2: "",
    name: "",
    phone: "",
    phone2: ""
  };
  
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private photoService: PhotoService, 
    private customerService: CustomerService,
    private uiService: UIService,
    private dialog: MatDialog ) { 

      this.route.params.subscribe(p => {
        if (p['id'] != 'new'){
          this.customer.customer_id = +p['id'];
        }
        
      }, err => {
        if (err.status == 404)
          this.router.navigate(['/customer']);
      });

    }

  ngOnInit() {
    
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.uiService.loadingStateChanged.next(true);
    this.customerService.getCustomer( this.customer.customer_id )
      .subscribe(
        data => {
        this.customer = data;
        this.uiService.loadingStateChanged.next(false);
      },
      err => {
        this.uiService.loadingStateChanged.next(false);
      })
    } 
    
    uploadPhoto(){
      var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
      this.uiService.loadingStateChanged.next(true);
      this.photoService.upload(this.customer.customer_id, nativeElement.files[0])
      .subscribe(
        data => { 
        this.customer.logo_url = data.logo_url;
        this.uiService.showSnackBar("Logo has been updated successfully", null, 3000);
        this.uiService.loadingStateChanged.next(false);
        },
        error => {
          this.uiService.showSnackBar("An error has occurred. Image was not uploaded successfully", null, 3000);
          this.uiService.loadingStateChanged.next(false);
        }
    );
    }

    removeElement(){
      const dialogRef = this.dialog.open(RemoveElementComponent, {
        data: {
          record: this.customer.name
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result){
          
          this.uiService.loadingStateChanged.next(true);
          this.customerService.deleteCustomer(this.customer.customer_id)
          .subscribe(
            data => {
              this.uiService.loadingStateChanged.next(false);
              this.uiService.showSnackBar("Customer has been removed successfully", null, 3000);
              this.router.navigate(['/customer']);
            },
            error => {
              this.uiService.loadingStateChanged.next(false);
              this.uiService.showSnackBar("An error has occurred. Customers was not removed.", null, 3000);
            });
          
        }
        
      });

    }

  }

