import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WelcomeComponent } from "./welcome/welcome.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";
import { TrainingComponent } from "./training/training.component";
import { AuthGuard } from "./auth/auth.guard";
import { CustomerComponent } from "./customer/customer.component";
import { ServiceComponent } from "./service/service.component";
import { ProjectComponent } from "./project/project.component";
import { CustomerDetailComponent } from "./customer/customer-detail/customer-detail.component";
import { CustomerFormComponent } from "./customer/customer-form/customer-form.component";
import { ServiceFormComponent } from "./service/service-form/service-form.component";
import { ServiceDetailComponent } from "./service/service-detail/service-detail.component";
import { ProjectFormComponent } from "./project/project-form/project-form.component";
import { ProjectDetailComponent } from "./project/project-detail/project-detail.component";

const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'training', component: TrainingComponent, canActivate: [AuthGuard] },
    { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] },
    { path: 'customer/details/:id', component: CustomerDetailComponent, canActivate: [AuthGuard] },
    { path: 'customer/:id', component: CustomerFormComponent, canActivate: [AuthGuard] },
    { path: 'customer/new', component: CustomerFormComponent, canActivate: [AuthGuard] },
    { path: 'service', component: ServiceComponent, canActivate: [AuthGuard] },
    { path: 'service/details/:id', component: ServiceDetailComponent, canActivate: [AuthGuard] },
    { path: 'service/:id', component: ServiceFormComponent, canActivate: [AuthGuard] },
    { path: 'service/new', component: ServiceFormComponent, canActivate: [AuthGuard] },
    { path: 'project', component: ProjectComponent, canActivate: [AuthGuard] },
    { path: 'project/details/:id', component: ProjectDetailComponent, canActivate: [AuthGuard] },
    { path: 'project/:id', component: ProjectFormComponent, canActivate: [AuthGuard] },
    { path: 'project/new', component: ProjectFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule{

}