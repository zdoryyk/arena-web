import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Permission } from '../interfaces/permissions';
import { User, UserData } from '../interfaces/user';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private identity: any;
  private permission: Permission = 'None';
  platformId: Object;
  private isLoggedInSource = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSource.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object,private router: Router, private transferState: TransferState,private http: HttpClient) {
    this.platformId = platformId;
    if(isPlatformBrowser(platformId)){
      const isLoggedIn = !!localStorage.getItem('arena-token'); 
      this.isLoggedInSource.next(isLoggedIn);
    }
  }


  async validateToken(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = !!localStorage.getItem('arena-token');
      this.isLoggedInSource.next(isLoggedIn);
      // if (!isLoggedIn) {
      //   await this.router.navigate(['/login']);
      //   return Promise.resolve();
      // }
    }
    return Promise.resolve();
  }
  

  setLoggedIn(isLoggedIn: boolean) {
    if(!isLoggedIn){
      localStorage.clear();
    }
    this.isLoggedInSource.next(isLoggedIn);
  }
  
  isAuthed(): boolean{
    if(isPlatformBrowser(this.platformId) && !!localStorage.getItem('arena-token')){
       return true;
    }else{
      return false;
    }
  }

  isTeacher(): boolean{
    const isTeacher = this.getPermission() === Permission.Teacher;
    if(!isTeacher){
      this.router.navigate['/redirect'];
      return false;
    }
    return true;
  }

  async checkIsUserInStorage(): Promise<UserData> {
    if (!this.transferState.hasKey(makeStateKey('arena-user'))) {
      const user = await this.getUser(); 
      if (user) { 
        this.transferState.set<UserData>(makeStateKey('arena-user'), user);
      }
      return user;
    }
    return this.transferState.get<UserData>(makeStateKey('arena-user'), null);
  }


  async getUser(): Promise<UserData> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const token = this.getToken();
    if (token) {
      const user: User = await firstValueFrom(this.getUserMe(token));
      this.transferState.set<UserData>(makeStateKey<UserData>('arena-user'), user.data);
      this.identity = user;
      return user.data;
    }
    return null; 
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

  getUserMe(token: any): Observable<User> {
    var routePath = environment.api_url + "/users/me";
    return this.http.get<User>(routePath, {
      headers: {
        "Authorization": 'token ' + token
      }
    });
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  logout(): Observable<any> {
    return this.http.get<any>( environment.api_url + "/logout", {
      headers: {
          "Authorization": localStorage.getItem("token")
      }
    });
  }

}