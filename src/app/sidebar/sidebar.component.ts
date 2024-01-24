import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  isLoggedIn = true;  
  constructor(private router: Router){
  }

  onLogout(){
    this.isLoggedIn = !this.isLoggedIn;
    if(!this.isLoggedIn){
      this.router.navigate(['/login']);
    }
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
