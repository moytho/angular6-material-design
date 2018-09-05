import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Service } from '../service.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UIService } from '../../shared/ui.service';
import { MatDialog } from '@angular/material';
import { ServiceService } from '../service.service';
import { RemoveElementComponent } from '../../shared/remove-record.component';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;
  service: Service = {
    service_id: null,
    name: "",
    description: "",
    monthly_fee: 0,
    one_time_fee: 0,
    active: true
  };
  
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private serviceService: ServiceService,
    private uiService: UIService,
    private dialog: MatDialog
  ) { 

    this.route.params.subscribe(p => {
      if (p['id'] != 'new'){
        this.service.service_id = +p['id'];
      }
      
    }, err => {
      if (err.status == 404)
        this.router.navigate(['/service']);
    });

    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

  }

  ngOnInit() {
    

    this.uiService.loadingStateChanged.next(true);
    this.serviceService.getService( this.service.service_id )
      .subscribe(
        data => {
        this.service = data;
        this.uiService.loadingStateChanged.next(false);
      },
      err => {
        this.uiService.loadingStateChanged.next(false);
      })

  }

  removeElement(){
    const dialogRef = this.dialog.open(RemoveElementComponent, {
      data: {
        record: this.service.name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        
        this.uiService.loadingStateChanged.next(true);
        this.serviceService.deleteService(this.service.service_id)
        .subscribe(
          data => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackBar("Service has been removed successfully", null, 3000);
            this.router.navigate(['/service']);
          },
          error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackBar("An error has occurred. Service was not removed.", null, 3000);
          });
        
      }
      
    });

  }

}
