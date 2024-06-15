import { HttpInterceptorFn } from '@angular/common/http';
import {
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Permission } from '../interfaces/permissions';
import { AuthService } from '../pages/login/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return next(req).pipe(
     map((event: HttpEvent<any>) => {
       if (event instanceof HttpResponse) {
         if (event.url?.includes('cas-token')) {
           window.open(event.url, '_self');
         } else if (event.url?.includes('logout')) {
           window.open(event.url, '_self');
         }
       }
       return event;
     }),
     catchError( (error: HttpErrorResponse) => {
      //  const isTeacher = authService.getPermission() === Permission.Teacher;
       if (error.status === 403) {
        authService.setLoggedIn(false);
        localStorage.clear();
        router.navigate(['login']);
       }
       return throwError(() => error);
     })
   );
 };
