import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { ThemeService } from '../core-services/theme.service';
import {DropdownModule} from 'primeng/dropdown';
import { LanguageService } from '../core-services/language.service';
import { AuthService } from '../pages/login/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,MatIconModule,DropdownModule,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit,AfterViewInit {
  dynamicRouteDashboard: string | any[] = '/dashboard';
  dynamicRouteCoursesOrProblemsets: string | any[] = '/problemsets';
  platformId: Object;
  isTeacher = false;
  isLoggedIn = false;
  fullName: string = 'none';
  tempName = '';
  isDarkTheme: boolean = false;
  language = 'en';
  languages: string[] = ['en','sk', 'ua', 'ru'];
  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object,
    private sanitizer: DomSanitizer,
    private matIconRegistery: MatIconRegistry,
    private themeService: ThemeService,
    private renderer: Renderer2,
    private languageService: LanguageService,
    ) {
    this.platformId = platformId;
    this.matIconRegistery.addSvgIcon(
      'bug',
      this.sanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/bug.svg'),
    );
    this.matIconRegistery.addSvgIcon(
      'logout',
      this.sanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/logout.svg'),
    );
    this.matIconRegistery.addSvgIcon(
      'theme_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/theme_icon.svg')
    );
  }
  async ngAfterViewInit() {

  }


  async ngOnInit() {
    if(isPlatformBrowser(this.platformId)){
      this.language = localStorage.getItem('lang') || 'en';
      this.themeService.theme$.subscribe(theme => {
        this.isDarkTheme = theme === 'dark-theme';
        this.renderer.removeClass(document.body, 'light-theme');
        this.renderer.removeClass(document.body, 'dark-theme');
        this.renderer.addClass(document.body, theme);
      });
      this.authService.isLoggedIn$.subscribe((loggedIn) => {
        this.isLoggedIn = loggedIn;
        if (loggedIn) {
          this.getUsername();
          this.isTeacher = localStorage.getItem('arena-permission') === 'Teacher';
          this.configureRoutes();
        }
      });
    }
  }

  async getUsername(){
    let user = await this.authService.checkIsUserInStorage();
    if(user && user.attributes['first-name'] && user.attributes['last-name']) {
      this.fullName = `${user.attributes['first-name']} ${user.attributes['last-name']}`;
      this.tempName = this.fullName;
      this.fullName = '';
    }
  }

  configureRoutes() {
    if(this.isTeacher){
      this.dynamicRouteDashboard = '/admin-dashboard';
      this.dynamicRouteCoursesOrProblemsets = '/admin-courses';
    } else {
      this.dynamicRouteDashboard = '/dashboard';
      this.dynamicRouteCoursesOrProblemsets = '/problemsets';
    }
  }

  async onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.clear();
      },
      error: () => {
        localStorage.clear();
        const url =
          `${environment.logout_url}/cas-logout?next=api/v1/cas-token?callback=${environment.base_url}/login`;
        window.open(url, "_self");
      },
      complete: () => {
        const url =
          `${environment.logout_url}/cas-logout?next=api/v1/cas-token?callback=${environment.base_url}/login`;
         window.open(url, "_self");
      }
    });
  }

  onToggle() {
    const sidebar = document.getElementById('sidebar') as HTMLElement;
    const btn = document.getElementById('panel-show') as HTMLElement;
    const content = document.getElementById('main') as HTMLElement;
    const sidebarMain = document.getElementById('sidebar-main') as HTMLElement;
    const sidebarSecondary = document.getElementById('sidebar-secondary') as HTMLElement;
    const listItems = document.querySelectorAll('.list-item');

    if (sidebar.style.left === '-200px') {
        sidebar.style.left = '0';
        btn.style.transform = 'rotate(360deg)';
        content.classList.add('mg-left');
        sidebarMain.style.display = 'block';
        sidebarSecondary.style.display = 'none';
        listItems.forEach(item => (item as HTMLElement).style.justifyContent = "start");

        this.fullName = this.tempName;
    } else {
        sidebar.style.left = '-200px';
        btn.style.transform = 'rotate(180deg)';
        content.classList.remove('mg-left');
        sidebarMain.style.display = 'none';
        sidebarSecondary.style.display = 'block';
        listItems.forEach(item => (item as HTMLElement).style.justifyContent = "end");
        this.fullName = '';
    }
  }

  switchLanguage(lang: string){
    this.languageService.setLanguage(lang);
  }


  toggleTheme(){
    this.isDarkTheme = !this.isDarkTheme;
    this.themeService.toggleTheme();
  }

  getCurrentTheme(){
    return this.themeService.currentTheme;
  }
}
