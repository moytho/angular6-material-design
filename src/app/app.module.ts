import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { TrainingComponent } from './training/training.component';
import { CurrentTrainingComponent } from './training/current-training/current-training.component';
import { NewTrainingComponent } from './training/new-training/new-training.component';
import { PastTrainingComponent } from './training/past-training/past-training.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { StopTrainingComponent } from './training/current-training/stop-training.component';
import { AuthService } from './auth/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import { TrainingService } from './training/training.service';
import { UserService } from './auth/user.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { CustomerService } from './customer/customer.service';
import { CustomerComponent } from './customer/customer.component';
import { ServiceComponent } from './service/service.component';
import { ProjectComponent } from './project/project.component';
import { ServiceService } from './service/service.service';
import { ProjectService } from './project/project.service';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { MessageService } from './message.service';
import { HttpErrorHandler } from './http-error-handler.service';
import { UIService } from './shared/ui.service';
import { CustomerFormComponent } from './customer/customer-form/customer-form.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { PhotoService } from './customer/customer.photo.service';
import { HttpModule } from '@angular/http';
import { RemoveElementComponent } from './shared/remove-record.component';
import { ServiceDetailComponent } from './service/service-detail/service-detail.component';
import { ServiceFormComponent } from './service/service-form/service-form.component';
import { ProjectFormComponent } from './project/project-form/project-form.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
    StopTrainingComponent,
    RemoveElementComponent,
    CustomerComponent,
    ServiceComponent,
    ProjectComponent,
    CustomerDetailComponent,
    CustomerFormComponent,
    ServiceDetailComponent,
    ServiceFormComponent,
    ProjectFormComponent,
    ProjectDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatMomentDateModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule
  ],
  providers: [
    AuthService, 
    HttpErrorHandler,
    MessageService,
    TrainingService, 
    UserService,
    CustomerService,
    ServiceService,
    ProjectService,
    UIService,
    PhotoService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  bootstrap: [AppComponent],
  entryComponents: [StopTrainingComponent, RemoveElementComponent]
})
export class AppModule { }
