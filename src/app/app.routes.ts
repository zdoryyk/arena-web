import { Routes } from '@angular/router';
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { ProblemsetsComponent } from "./pages/problemsets/problemsets.component";
import { LoginComponent } from "./pages/login/login.component";
import { ProblemsetDetailComponent } from "./pages/problemsets/problemset-detail/problemset-detail.component";
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminCoursesComponent } from './pages/admin/admin-courses/admin-courses.component';
import { AdminCourseComponent } from './pages/admin/admin-course/admin-course.component';
import { AuthGuard } from './guards/auth.guard';
import { TeacherGuard } from './guards/teacher.guard';
import { ProblemestsDetailComponent } from './pages/problemsets/problemests-detail/problemests-detail.component';
import { EmptyPageComponent } from './pages/empty-page/empty-page.component';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo:'redirect'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'redirect',
    component: EmptyPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard], 
  },
  {
    path: 'problemsets',
    component: ProblemsetsComponent,
    canActivate: [AuthGuard], 
  },
  {
    path: 'problemset-submissions/:id',
    component: ProblemestsDetailComponent,
    canActivate: [AuthGuard], 
  },
  {
    path: 'submission/:id',
    component: ProblemsetDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard,TeacherGuard]
  },
  {
    path: 'admin-courses',
    component: AdminCoursesComponent,
    canActivate: [AuthGuard,TeacherGuard]
  },
  {
    path: 'admin-course/:id',
    component: AdminCourseComponent,
    canActivate: [AuthGuard,TeacherGuard]
  },
  {
    path: '**',
    redirectTo: 'redirect', pathMatch: 'full',
  },
];
