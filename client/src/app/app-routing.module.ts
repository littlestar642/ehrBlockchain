import { HistoryDetailComponent } from './history-detail/history-detail.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DoctorRegistrationComponent } from './doctor-registration/doctor-registration.component';
import { HistoryComponent } from './history/history.component';
import { PatientConsentComponent } from './patient-consent/patient-consent.component';
import { PatientOnboardingComponent } from './patient-onboarding/patient-onboarding.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { DoctorHomeComponent } from './doctor-home/doctor-home.component';
import { PatientLoginComponent } from './patient-login/patient-login.component';
import { DoctorLoginComponent } from './doctor-login/doctor-login.component';
import { DoctorOptionComponent} from './doctor-option/doctor-option.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { PatientChoiceComponent } from './patient-choice/patient-choice.component';

const routes: Routes = [
  { path : "doctorLogin", component : DoctorLoginComponent },
  { path : "patientChoice", component : PatientChoiceComponent },
  { path : "homepage", component : HomepageComponent },
  { path : "doctorRegistration", component : DoctorRegistrationComponent},
  { path : "patientLogin", component : PatientLoginComponent },
  { path : "doctorHome/:doctorId", component : DoctorHomeComponent, canActivate : [AuthGuardService] },
  { path : "patientHome/:patientId", component : PatientHomeComponent },
  { path : "patientOnboarding", component : PatientOnboardingComponent, canActivate : [AuthGuardService] },
  { path : "patientConsent", component : PatientConsentComponent, canActivate : [AuthGuardService] },
  { path : "doctorOption", component : DoctorOptionComponent, canActivate : [AuthGuardService] },
  { path: "history", component : HistoryComponent, canActivate : [AuthGuardService]},
  { path : "historyDetail/:recordNumber", component: HistoryDetailComponent, canActivate : [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
