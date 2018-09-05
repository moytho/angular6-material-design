import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UIService } from '../../shared/ui.service';
import { ProjectService } from '../project.service';
import { MatDialog } from '@angular/material';
import { Project } from '../project.model';
import { Subscription } from 'rxjs';
import { RemoveElementComponent } from '../../shared/remove-record.component';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  isLoading = false;
  private loadingSubs: Subscription;
  edit: boolean = false;
  project: Project = {
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
  
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private projectService: ProjectService,
    private uiService: UIService,
    private dialog: MatDialog ) { 

      this.route.params.subscribe(p => {
        if (p['id'] != 'new'){
          this.project.project_id = +p['id'];
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
    this.projectService.getProject( this.project.project_id )
      .subscribe(
        data => {
        this.project = data;
        console.log(this.project.customer.name);
        this.uiService.loadingStateChanged.next(false);
      },
      err => {
        this.uiService.loadingStateChanged.next(false);
      })
    } 
    
    removeElement(){
      const dialogRef = this.dialog.open(RemoveElementComponent, {
        data: {
          record: this.project.name
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result){
          
          this.uiService.loadingStateChanged.next(true);
          this.projectService.deleteProject(this.project.project_id)
          .subscribe(
            data => {
              this.uiService.loadingStateChanged.next(false);
              this.uiService.showSnackBar("Project has been removed successfully", null, 3000);
              this.router.navigate(['/project']);
            },
            error => {
              this.uiService.loadingStateChanged.next(false);
              this.uiService.showSnackBar("An error has occurred. Project was not removed.", null, 3000);
            });
          
        }
        
      });

    }


}
 