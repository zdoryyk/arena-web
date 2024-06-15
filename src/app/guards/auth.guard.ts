import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../pages/login/auth.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const isAuthed = inject(AuthService).isAuthed();
  if(!isAuthed){
    router.navigate(['/redirect']);
  }
  return isAuthed;
};
