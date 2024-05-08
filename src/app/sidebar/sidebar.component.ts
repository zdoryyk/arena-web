import { Component, Inject, OnInit, PLATFORM_ID, Renderer2, TransferState, booleanAttribute, makeStateKey } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  dynamicRouteDashboard: string | any[] = '/dashboard';
  dynamicRouteCoursesOrProblemsets: string | any[] = '/problemsets';
  platformId: Object;
  isTeacher = false; 
  isLoggedIn = false;  
  fullName: string = 'none';
  tempName = '';
  isDarkTheme: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object,
    private sanitizer: DomSanitizer,
    private matIconRegistery: MatIconRegistry,
    private themeService: ThemeService,
    private renderer: Renderer2
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


  async ngOnInit() {
    if(isPlatformBrowser(this.platformId)){
      this.themeService.theme$.subscribe(theme => {
        this.isDarkTheme = theme === 'dark-theme';
        this.renderer.removeClass(document.body, 'light-theme');
        this.renderer.removeClass(document.body, 'dark-theme');
        this.renderer.addClass(document.body, theme);
      });
      this.authService.isLoggedIn$.subscribe((loggedIn) => {
        this.isLoggedIn = loggedIn;
        if (loggedIn) {
          this.isTeacher = localStorage.getItem('arena-permission') === 'Teacher';
          this.configureRoutes();
        }
      });
      const user = await this.authService.checkIsUserInStorage();
      if(user && user.attributes['first-name'] && user.attributes['last-name']) {
        this.fullName = `${user.attributes['first-name']} ${user.attributes['last-name']}`;
        this.tempName = this.fullName;
        this.fullName = '';
      }
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

  onLogout() {
    this.authService.setLoggedIn(false);
    window.location.reload();
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

  toggleTheme(){
    this.isDarkTheme = !this.isDarkTheme;
    this.themeService.toggleTheme();
  }

  getCurrentTheme(){
    return this.themeService.currentTheme;
  }
}
