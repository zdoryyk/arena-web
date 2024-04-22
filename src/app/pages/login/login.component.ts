import { Component, Inject, OnInit, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from './login.service';
import { Subscription, firstValueFrom, take } from 'rxjs';
import { Permission } from '../../interfaces/permissions';
import { environment } from '../../../environments/environment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,CommonModule,ProgressSpinnerModule,ToastModule],
  providers:[MessageService],
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
  isLoading = false;
  platformId: Object;
  private tokenSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (params['cas_token']) {
        await this.handleThirdPartyLogin(params['cas_token']);
      }
    });
  }

  async checkIsUserLoggedIn() {
    let user = await this.authService.checkIsUserInStorage();
    if (user) {
      this.router.navigate(['/dashboard']);
    }
  }

  private async handleThirdPartyLogin(casTokenValue: string) {
    const casToken = { "cas_token": casTokenValue };
    this.clearParams();
    this.isLoading = true;
    try {
      const resultToken = await firstValueFrom(this.loginService.getToken(casToken));
      try {
        const resultUser = await firstValueFrom(this.loginService.getUserMe(resultToken.token));
        if (resultUser.data.attributes['is-lecturer']) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('arena-permission', Permission.Teacher);
          }
        } else {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('arena-permission', Permission.Student);
          }
        }
  
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem("arena-token", resultToken.token);
          this.authService.checkIsUserInStorage();
        }
        await this.delay(2000);
        if (resultUser.data.attributes['is-lecturer']) {
          this.router.navigate(['/admin-courses']);
        } else {
          this.router.navigate(['/dashboard']);
        }
        this.authService.setLoggedIn(true);
      } catch (error) {
        this.handleApiError(error);
      }
    } catch (error) {
      this.handleApiError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleApiError(error: any) {
    const status = error.status;
    switch(status) {
      case 403:
        this.show('error','Error',`Access is forbidden. Please check your permissions.`);
        break;
      case 429:
        this.show('warn','Warning',`Too many requests. Please try again later.`);
        break;
      default:
        this.show('info','Info',`An error occurred. Please try again.`);
        break;
    }
  }

  loginViaThirdPartyService() {
    window.open(environment.api_url + "/cas-token?callback=" + environment.base_url + "/login", "_self");
  }

  show(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  clearParams(){
    this.router.navigate([], {
      queryParams: {
        'cas_token': null,
      },
      queryParamsHandling: 'merge'
    })
  }

}
