import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const isAuthed = inject(AuthService).isAuthed();
  const router = inject(Router);
  // if(!isAuthed){
  //   router.navigate(['/redirect']);
  // }
  return inject(AuthService).isAuthed();
};
