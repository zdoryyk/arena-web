import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  onToggle() {
    const btnMenu = document.querySelectorAll('.btn-menu');
    const menu = document.getElementById('menu') as HTMLElement;

    btnMenu.forEach(btn => btn.classList.toggle('hidden'));
    menu.classList.toggle('menu-hidden');
  }
}
