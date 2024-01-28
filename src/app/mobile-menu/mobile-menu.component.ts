import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,  
  imports: [RouterModule,],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css'
})

export class MobileMenuComponent {
  
  isLoggedIn = true;  
  constructor(private router: Router){
  }

  onLogout(){
    this.isLoggedIn = !this.isLoggedIn;
    if(!this.isLoggedIn){
      this.router.navigate(['/login']);
    }

    this.onToggle();
  }
  
  onToggle() {
    const btnMenu = document.querySelectorAll('.btn-menu');
    const menu = document.getElementById('menu') as HTMLElement;

    btnMenu.forEach(btn => btn.classList.toggle('hidden'));
    menu.classList.toggle('menu-hidden');
  }
}
