import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../pages/login/auth.service';

export const TeacherGuard: CanActivateFn = (route, state) => {
  const isTeacher = inject(AuthService).isTeacher();
  const router = inject(Router);
  return new Observable<boolean>(obs => {
    if(!isTeacher){
      router.navigate(['/redirect']);
    }
    return obs.next(isTeacher);
    });
};
