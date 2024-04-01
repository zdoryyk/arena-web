import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,  
  imports: [RouterModule,],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss'
})

export class MobileMenuComponent implements OnInit{
  
  dynamicRouteDashboard: string | any[] = '/dashboard';
  dynamicRouteCoursesOrProblemsets: string | any[] = '/problemsets';
  platformId: Object;
  isTeacher = false; 
  isLoggedIn = true;  
  fullName: string = 'none';
  constructor(private router: Router, private authService: AuthService,@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId;
  }

  async ngOnInit() {
    if(isPlatformBrowser(this.platformId)){
      this.isTeacher = localStorage.getItem('arena-permission') === 'Teacher';
      const user = await this.authService.checkIsUserInStorage();
      if(user.attributes['first-name'] && user.attributes['last-name']) {
        this.fullName = `${user.attributes['first-name']} ${user.attributes['last-name']}`;
      }
      if(this.isTeacher){
        this.dynamicRouteDashboard =  '/admin-dashboard';
        this.dynamicRouteCoursesOrProblemsets = '/admin-courses';
      }
    }
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
}
