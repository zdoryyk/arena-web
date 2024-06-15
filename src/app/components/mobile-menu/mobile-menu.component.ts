import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { ThemeService } from '../../core-services/theme.service';
import { AuthService } from '../../pages/login/auth.service';
import { LanguageService } from '../../core-services/language.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [RouterModule,MatIconModule,DropdownModule,CommonModule],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss'
})

export class MobileMenuComponent implements OnInit{

  dynamicRouteDashboard: string | any[] = '/dashboard';
  dynamicRouteCoursesOrProblemsets: string | any[] = '/problemsets';
  platformId: Object;
  isTeacher = false;
  isLoggedIn = true;
  fullName: string = '';
  isDarkTheme: boolean = false;
  language = 'en';
  languages: string[] = ['en','sk', 'ua', 'ru'];

  constructor(
    private router: Router,
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
    )
  }

  async ngOnInit() {
    const user = await this.authService.checkIsUserInStorage();
    if(user && user.attributes['first-name'] && user.attributes['last-name']) {
      this.fullName = `${user.attributes['first-name']} ${user.attributes['last-name']}`;
    }
    if(isPlatformBrowser(this.platformId)){
      this.language = localStorage.getItem('lang') || 'en';
      this.themeService.theme$.subscribe(theme => {
        this.isDarkTheme = theme === 'dark-theme';
        this.renderer.removeClass(document.body, 'light-theme');
        this.renderer.removeClass(document.body, 'dark-theme');
        this.renderer.addClass(document.body, theme);
      });
      this.isTeacher = localStorage.getItem('arena-permission') === 'Teacher';
      if(this.isTeacher){
        this.dynamicRouteDashboard =  '/admin-dashboard';
        this.dynamicRouteCoursesOrProblemsets = '/admin-courses';
      }
    }
  }

  switchLanguage(lang: string){
    this.languageService.setLanguage(lang);
  }


  onLogout() {
    this.authService.setLoggedIn(false);
    localStorage.clear();
    this.router.navigate(['/login']);
    this.onToggle();
  }

  onToggle() {
    const btnMenu = document.querySelectorAll('.btn-menu');
    const menu = document.getElementById('menu') as HTMLElement;

    btnMenu.forEach(btn => btn.classList.toggle('hidden'));
    menu.classList.toggle('menu-hidden');
  }

  toggleTheme(){
    this.isDarkTheme = !this.isDarkTheme;
    this.themeService.toggleTheme();
  }

}
