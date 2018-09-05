import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';
import { UIService } from '../../shared/ui.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;
  title: string = "New Customer";
  edit: boolean = false;
  private request;
  private customer: Customer = {
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
  private customerId: number;

  constructor( 
    private router:Router,
    private route:ActivatedRoute,
    private customerService: CustomerService,
    private uiService: UIService) { 

    //let now = moment(); // add this 2 of 4
    //console.log('hello world', now.format('YYYY-MM-DD')); // add this 3 of 4
      
      this.route.params.subscribe(p => {
        if (p['id'] != 'new'){
          this.customer.customer_id = +p['id'];
          this.title = "Edit Customer";
          this.edit = true;
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

    this.initializeForm();

    if (this.customer.customer_id){
      this.uiService.loadingStateChanged.next(true);
      this.customerService.getCustomer( this.customer.customer_id )
      .subscribe(
        data => {
        this.customer = data;
        this.initializeForm();
        this.uiService.loadingStateChanged.next(false);
      },
      err => {
        this.uiService.loadingStateChanged.next(false);
      })
    } 
    
  }

  onSubmit(){

    this.form.value.billed_date = this.form.value.billed_date_object.format('YYYY-MM-DD');

    this.request = this.getRequest(this.form.value);

    this.uiService.loadingStateChanged.next(true);
    this.request
    .subscribe(
      data => {

        this.uiService.loadingStateChanged.next(false);

        if (this.edit)
          this.uiService.showSnackBar("Customer updated successfully", null, 3000);
        else
          this.uiService.showSnackBar("Customer created successfully", null, 3000);

        this.router.navigate(['/customer/details/' + data.customer_id]);
      },
    error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackBar("An error has occurred. Customers was not saved.", null, 3000);
    });

  }

 getRequest(formValues){
   
    if (this.edit){
      return this.customerService.updateCustomer(formValues);
    } else {
      return this.customerService.saveCustomer(formValues);
    }
  }

  initializeForm(){
    
    if ( this.customer.billed_date ){
      this.customer.billed_date_object = moment(this.customer.billed_date);
    } else {
      this.customer.billed_date_object = moment();
    }

    this.form = new FormGroup({
      customer_id: new FormControl(this.customer.customer_id),
      email: new FormControl(this.customer.email, { 
        validators: [ Validators.required, Validators.email ] 
      }),
      email2: new FormControl(this.customer.email2, { 
        validators: [  Validators.email ] 
      }), 
      name: new FormControl(this.customer.name,{ 
        validators: [ Validators.required ] 
      }),
      company: new FormControl(this.customer.company,{ 
        validators: [ Validators.required ] 
      }), 
      phone: new FormControl(this.customer.phone,{ 
        validators: [ Validators.required ] 
      }), 
      phone2: new FormControl(this.customer.phone2,{ 
        
      }), 
      address: new FormControl(this.customer.address,{ 
         
      }),
      address2: new FormControl(this.customer.address2,{ 
         
      }),
      billed_date_object: new FormControl(this.customer.billed_date_object,{ 
         validators: [ Validators.required ]
      }),
      
    });
  }

}
