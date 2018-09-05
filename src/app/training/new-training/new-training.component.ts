import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { CustomerService } from '../../customer/customer.service';
import { ServiceService } from '../../service/service.service';
import { ProjectService } from '../../project/project.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

exercises: Exercise [] = [];
  constructor(
    private trainingService: TrainingService, 
    private customerService: CustomerService, 
    private serviceService: ServiceService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm){
    // this.trainingService.startExercise(form.value.exercise);
    // this.projectService.getProjects()
    // .subscribe( 
    //   data => { 
    //     console.log(data);
    //   });
  }

}
