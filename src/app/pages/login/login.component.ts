import { Component, Inject, OnInit, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from './login.service';
import { Subscription } from 'rxjs';
import { Permission } from '../../interfaces/permissions';
import { environment } from '../../../environments/environment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,CommonModule],
  providers:[],
  animations: [
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInFromTop', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInFromRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  
  platformId: Object;
  private tokenSubscription: Subscription = new Subscription;
  private userSubscription: Subscription = new Subscription;
  constructor
  (
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ){
    this.platformId = platformId;
  }

    


  async ngOnInit() {
    this.checkIsUserLoggedIn();
    this.route.queryParams.subscribe(params => {
      if (params['cas_token']) {
        this.handleThirdPartyLogin(params['cas_token']);
      }
    });
  }

  async checkIsUserLoggedIn(){
    let user = await this.authService.checkIsUserInStorage();
    if(user){
      this.router.navigate(['/dashboard']);
    }
  }

  private handleThirdPartyLogin(casTokenValue: string){
    var casToken = {
      "cas_token": casTokenValue
    };
    this.tokenSubscription = this.loginService.getToken(casToken).subscribe(resultToken => {
      this.userSubscription = this.loginService.getUserMe(resultToken.token).subscribe(resultUser => {
        console.log(resultUser)
        this.authService.setLoggedIn(true);
        if (resultUser.data.attributes['is-lecturer']) {
          if(isPlatformBrowser(this.platformId))
          localStorage.setItem('arena-permission', Permission.Teacher)
        }
        else {
          if(isPlatformBrowser(this.platformId))
          localStorage.setItem('arena-permission', Permission.Student)
        }
        if(isPlatformBrowser(this.platformId)){
          localStorage.setItem("arena-token", resultToken.token);
          this.authService.checkIsUserInStorage();
        }
          if(resultUser.data.attributes['is-lecturer']) {
            this.router.navigate(['/admin-courses']);
          }
          else {
            this.router.navigate(['/dashboard']);
          }
      });
    });
  }
  


  loginViaThirdPartyService(){
    window.open(environment.api_url + "/cas-token?callback=" + environment.base_url + "/login", "_self");
  }
}
