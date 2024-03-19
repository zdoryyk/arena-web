import { CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Permission } from '../interfaces/permissions';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from 'express';

export const TeacherGuard: CanActivateFn = (route, state) => {
  const isTeacher = inject(AuthService).isTeacher();
  return new Observable<boolean>(obs => {
      return obs.next(isTeacher);
    });
};
