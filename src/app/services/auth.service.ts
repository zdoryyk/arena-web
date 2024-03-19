import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Permission } from '../interfaces/permissions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private identity: any;
  private permission: Permission = 'None';
  platformId: Object;
  private isLoggedInSource = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSource.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object,private router: Router) {
    this.platformId = platformId;
    if(isPlatformBrowser(platformId)){
      const isLoggedIn = !!localStorage.getItem('arena-token'); 
      this.isLoggedInSource.next(isLoggedIn);
    }
  }

  setLoggedIn(isLoggedIn: boolean) {
    if(isLoggedIn == false){
      localStorage.clear();
    }
    this.isLoggedInSource.next(isLoggedIn);
  }
  isAuthed(): boolean{
    if(isPlatformBrowser(this.platformId) && !!localStorage.getItem('arena-token')){
       return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }
  }

  isTeacher(): boolean{
    const isTeacher = this.getPermission() === Permission.Teacher;
    if(!isTeacher){
      this.router.navigate['dashboard'];
      return false;
    }
    return true;
  }



   getUser() {
    if(!isPlatformBrowser(this.platformId)){
      return;
    }
    const data = localStorage.getItem('arena-user');
    if (data) {
      this.identity = JSON.parse(data);
    } else {

      return;
    }
    return this.identity;
  }

   getToken() {
    if(!isPlatformBrowser(this.platformId)){
      return;
    }
      const data = localStorage.getItem('arena-token');
      if (data) {
        return data;

      } else {
        return null;
      }
    
  }

  public getPermission(): Permission {
    if(!isPlatformBrowser(this.platformId)){
      return;
    }
      const data = localStorage.getItem('arena-permission');
      
      if (data) {
        if(data === 'Student'){
          this.permission = Permission.Student;
        }
        else {
          this.permission = Permission.Teacher;
        }
      } else {
      }
      return this.permission;
    
  }


}
