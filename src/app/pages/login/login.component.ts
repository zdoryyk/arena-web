import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from './login.service';
import { firstValueFrom } from 'rxjs';
import { Permission } from '../../interfaces/permissions';
import { environment } from '../../../environments/environment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ThemeService } from '../../core-services/theme.service';
import { LanguageService } from '../../core-services/language.service';
import { AuthService } from './auth.service';


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
  isVisible = false;
  isLoading = false;
  platformId: Object;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private messageService: MessageService,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
  }

  async ngOnInit() {
    const token = this.authService.getToken();
    if(token){
      this.router.navigate(['/redirect']);
      return;
      }
      if(isPlatformBrowser(this.platformId)){
      this.themeService.theme$.subscribe(theme => {
        this.renderer.removeClass(document.body, 'light-theme');
        this.renderer.removeClass(document.body, 'dark-theme');
        this.renderer.addClass(document.body, theme);
      });
    }
    this.route.queryParams.subscribe(async params => {
      if (params['err']) {

      }
      else if (params['cas_token']) {
        await this.handleThirdPartyLogin(params['cas_token']);
      }
      else {
        if(isPlatformBrowser(this.platformId)){
          window.open(environment.api_url +"/cas-token?callback=" + environment.base_url + "/login", "_self");
        }
      }
    });
  }

  private async handleThirdPartyLogin(casTokenValue: string) {
    this.isVisible = true;
    this.isLoading = true;
    const casToken = { "cas_token": casTokenValue };
    try {
      const resultToken = await firstValueFrom(this.loginService.getToken(casToken));
      try {
        const resultUser = await firstValueFrom(this.loginService.getUserMe(resultToken.token));
        if (isPlatformBrowser(this.platformId)) {
          if(resultUser.data.attributes['is-lecturer']){
            localStorage.setItem('arena-permission', Permission.Teacher);
          }else{
            localStorage.setItem('arena-permission', Permission.Student);
          }
          localStorage.setItem("arena-token", resultToken.token);
          await this.authService.checkIsUserInStorage();
        }
        await this.delay(2000);
        this.authService.setLoggedIn(true);
        if (resultUser.data.attributes['is-lecturer']) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
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
