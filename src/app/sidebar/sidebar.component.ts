import { Component, Inject, OnInit, PLATFORM_ID, booleanAttribute } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  dynamicRouteDashboard: string | any[] = '/dashboard';
  dynamicRouteCoursesOrProblemsets: string | any[] = '/problemsets';
  platformId: Object;
  isTeacher = false; 
  isLoggedIn = true;  
  fullName: string = 'none';
  constructor(private router: Router, private authService: AuthService,@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId;
  }


  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      this.isTeacher = localStorage.getItem('arena-permission') === 'Teacher';
      const user = JSON.parse(localStorage.getItem("arena-user") || '{}');
      if(user['first-name'] && user['last-name']) {
        this.fullName = `${user['first-name']} ${user['last-name']}`;
      }
      if(this.isTeacher){
        this.dynamicRouteDashboard =  '/admin-dashboard';
        this.dynamicRouteCoursesOrProblemsets = '/admin-courses';
      }
    }
    
  }

  navigateToDashboard(){
    console.log(this.isTeacher);
    if(this.isTeacher){
      this.router.navigate(['/admin-dashboard']);
      return;
    }
    this.router.navigate(['/dashboard']);
  }


  navigateToProblemsetsOrCourses(){
    if(this.isTeacher){
      this.router.navigate(['/admin-courses']);
      return;
    }
    this.router.navigate(['/courses']);
  }


  onLogout() {
    this.authService.setLoggedIn(false);
    localStorage.clear();
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
