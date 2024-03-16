import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {HeaderComponent} from "./components/header/header.component";
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterModule,LoginComponent,SidebarComponent,HeaderComponent,MobileMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'arena';
  isLoggedIn = true;
  constructor(private router: Router){
    
  }
}
