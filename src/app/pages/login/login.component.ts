import { Component, Inject, OnInit, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from './login.service';
import { Subscription } from 'rxjs';
import { Permission } from '../../interfaces/permissions';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
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
    private authSerivce: AuthService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) platformId: Object
  ){
    this.platformId = platformId;
  }

    


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['cas_token']) {
        this.handleThirdPartyLogin(params['cas_token']);
      }
    });
  }

  private handleThirdPartyLogin(casTokenValue: string){
    var casToken = {
      "cas_token": casTokenValue
    };
    this.tokenSubscription = this.loginService.getToken(casToken).subscribe(resultToken => {
      this.userSubscription = this.loginService.getUserMe(resultToken.token).subscribe(resultUser => {
        console.log(resultUser)
        this.authSerivce.setLoggedIn(true);
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
      this.authSerivce.checkIsUserInStorage();
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
    // window.open('https://arena.kpi.fei.tuke.sk/api/v1' + "/cas-token?callback=" + environment.base_url + "/login", "_self");
  }


}
