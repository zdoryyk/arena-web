import { Component, Inject, OnInit, PLATFORM_ID, TransferState, booleanAttribute, makeStateKey } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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
  fullName: string = 'none';
  isDarkMode: boolean;
  constructor(private router: Router, private authService: AuthService,@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId;
  }


  async ngOnInit() {
    if(isPlatformBrowser(this.platformId)){
      this.isTeacher = localStorage.getItem('arena-permission') === 'Teacher';
      const user = await this.authService.checkIsUserInStorage();
      if (user && user.attributes['first-name'] && user.attributes['last-name']) {
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
    this.router.navigate(['/login']);
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
    } else {
        sidebar.style.left = '-200px';
        btn.style.transform = 'rotate(180deg)';
        content.classList.remove('mg-left');
        sidebarMain.style.display = 'none';
        sidebarSecondary.style.display = 'block';
        listItems.forEach(item => (item as HTMLElement).style.justifyContent = "end");
    }
  }
}
