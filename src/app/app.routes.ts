import { Routes } from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {ProblemsetsComponent} from "./pages/problemsets/problemsets.component";
import {LoginComponent} from "./pages/login/login.component";
import {ProblemestsDetailComponent} from "./pages/problemsets/problemests-detail/problemests-detail.component";
import {ProblemsetDetailComponent} from "./pages/problemsets/problemset-detail/problemset-detail.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'problemsets',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'problemsets',
    component: ProblemsetsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'problemsets-detail',
    component: ProblemestsDetailComponent,
  },
  {
    path: 'problemset-detail',
    component: ProblemsetDetailComponent,
  },
];
