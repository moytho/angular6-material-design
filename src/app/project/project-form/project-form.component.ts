import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Project } from '../project.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../customer/customer.service';
import { ServiceService } from '../../service/service.service';
import { ProjectService } from '../../project/project.service';
import { UIService } from '../../shared/ui.service';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material';
import { Customer } from '../../customer/customer.model';
import { Service } from '../../service/service.model';
import { forkJoin, of } from "rxjs";
import Utils from '../../shared/utils';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;
  title: string = "New Project";
  edit: boolean = false;
  private request;
  customers: Customer[];
  services: Service[];

  private project: Project = {
    project_id: 0,
    name: "",
    description: "",
    observations: "",
    fee: 0,
    term: "",
    start_date: "",
    start_date_object: null,
    end_date: "",
    end_date_object: null,
    customer_id: 0,
    service_id: 0,
    customer: null,
    service: null,
    active: true
  };

  private projectId: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private serviceService: ServiceService,
    private projectService: ProjectService,
    private uiService: UIService
  ) {

    this.route.params.subscribe(p => {
      if (p['id'] != 'new') {
        this.project.project_id = +p['id'];
        this.title = "Edit Project";
        this.edit = true;
      }

    }, err => {
      if (err.status == 404)
        this.router.navigate(['/project']);
    });

  }

  ngOnInit() {

    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.uiService.loadingStateChanged.next(true);

    this.initializeForm();

    if (this.project.project_id) {

      forkJoin([
        this.customerService.loadCustomers("company", "", "asc", 1, 1000),
        this.serviceService.loadServices("name", "", "asc", 1, 100),
        this.projectService.getProject(this.project.project_id)
      ]).subscribe(

        data => {
          this.customers = data[0].data;
          this.services = data[1].data;
          this.project = data[2];
          this.uiService.loadingStateChanged.next(false);
          this.initializeForm();

        }, err => {
          if (err.status == '404')
            this.router.navigate(['/project']);
          this.uiService.loadingStateChanged.next(false);
        });

    } else {

      forkJoin([
        this.customerService.loadCustomers("name", "", "asc", 1, 1000),
        this.serviceService.loadServices("name", "", "asc", 1, 100),
      ]).subscribe(
        data => {

          this.customers = data[0].data;
          this.services = data[1].data;
          this.uiService.loadingStateChanged.next(false);

        }, err => {
          if (err.status == '404')
            this.router.navigate(['/project']);
          this.uiService.loadingStateChanged.next(false);
        });
    }


  }

  compareIds(id1: any, id2: any): boolean {
    const a1 = Utils.determineId(id1);
    const a2 = Utils.determineId(id2);
    return a1 === a2;
}

//compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

onChangeCustomer(event: MatSelectChange) {
  this.form.value.customer_id = event.value;
}

onChangeService(event: MatSelectChange) {
  this.form.value.service_id = event.value;
}

  onSubmit() {

    this.form.value.start_date = this.form.value.start_date_object.format('YYYY-MM-DD');
    this.form.value.end_date = this.form.value.end_date_object.format('YYYY-MM-DD');

    this.request = this.getRequest(this.form.value);

    this.uiService.loadingStateChanged.next(true);
    this.request
      .subscribe(
        data => {

          this.uiService.loadingStateChanged.next(false);

          if (this.edit)
            this.uiService.showSnackBar("Project updated successfully", null, 3000);
          else
            this.uiService.showSnackBar("Project created successfully", null, 3000);

          this.router.navigate(['/project/details/' + data.project_id]);
        },
        error => {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackBar("An error has occurred. Project was not saved.", null, 3000);
        });

  }

  getRequest(formValues) {
    console.log("PROJECT: ",formValues);
    if (this.edit) {
      return this.projectService.updateProject(formValues);
    } else {
      return this.projectService.saveProject(formValues);
    }
  }

  initializeForm() {

    if (this.project.start_date) {
      this.project.start_date_object = moment(this.project.start_date);
    } else {
      this.project.start_date_object = moment();
    }

    if (this.project.end_date) {
      this.project.end_date_object = moment(this.project.end_date);
    } else {
      this.project.end_date_object = moment();
    }

    this.form = new FormGroup({
      project_id: new FormControl(this.project.project_id),
      name: new FormControl(this.project.name, {
        validators: [Validators.required]
      }),
      description: new FormControl(this.project.description, {
        validators: [Validators.required]
      }),
      observations: new FormControl(this.project.observations, {
        validators: [Validators.required]
      }),
      fee: new FormControl(this.project.fee, {
        validators: [Validators.required]
      }),
      term: new FormControl(this.project.term, {
        validators: [Validators.required]
      }),
      start_date_object: new FormControl(this.project.start_date_object, {
        validators: [Validators.required]
      }),
      end_date_object: new FormControl(this.project.end_date_object, {

      }),
      customer_id: new FormControl(this.project.customer_id, {
        validators: [Validators.required]
      }),
      service_id: new FormControl(this.project.service_id, {
        validators: [Validators.required]
      }),

    });
  }

}
