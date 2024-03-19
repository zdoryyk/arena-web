import { CanActivateFn } from '@angular/router';

export const initialRedirectGuard: CanActivateFn = (route, state) => {
  return true;
};
