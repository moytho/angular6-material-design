import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Service } from '../service.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UIService } from '../../shared/ui.service';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;
  title: string = "New Service";
  edit: boolean = false;
  private request;

  private service: Service = {
    service_id: null,
    description: "",
    monthly_fee: 0,
    one_time_fee: 0,
    name: "",
    active: true
  };
  private serviceId: number;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private serviceService: ServiceService,
    private uiService: UIService
  ) { 

    this.route.params.subscribe(p => {
      if (p['id'] != 'new'){
        this.service.service_id = +p['id'];
        this.title = "Edit Service";
        this.edit = true;
      }
      
    }, err => {
      if (err.status == 404)
        this.router.navigate(['/service']);
    });

  }

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.initializeForm();

    if (this.service.service_id){
      this.uiService.loadingStateChanged.next(true);
      this.serviceService.getService( this.service.service_id )
      .subscribe(
        data => {
        this.service = data;
        this.initializeForm();
        this.uiService.loadingStateChanged.next(false);
      },
      err => {
        this.uiService.loadingStateChanged.next(false);
      })
    } 
  }

  onSubmit(){

    this.request = this.getRequest(this.form.value);

    this.uiService.loadingStateChanged.next(true);
    this.request
    .subscribe(
      data => {

        this.uiService.loadingStateChanged.next(false);

        if (this.edit)
          this.uiService.showSnackBar("Service updated successfully", null, 3000);
        else
          this.uiService.showSnackBar("Service created successfully", null, 3000);

        this.router.navigate(['/service/details/' + data.service_id]);
      },
    error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackBar("An error has occurred. Customers was not saved.", null, 3000);
    });

  }

  getRequest(formValues){
   
    if (this.edit){
      return this.serviceService.updateService(formValues);
    } else {
      return this.serviceService.saveService(formValues);
    }
  }

  initializeForm(){
    
    this.form = new FormGroup({
      service_id: new FormControl(this.service.service_id),
      name: new FormControl(this.service.name,{ 
        validators: [ Validators.required ] 
      }),
      description: new FormControl(this.service.description,{ 
        validators: [ Validators.required ] 
      }), 
      monthly_fee: new FormControl(this.service.monthly_fee,{ 
        validators: [ Validators.required ] 
      }), 
      one_time_fee: new FormControl(this.service.one_time_fee,{ 
        validators: [ Validators.required ] 
      })
      
    });
  }

}
