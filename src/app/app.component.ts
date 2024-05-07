import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {HeaderComponent} from "./components/header/header.component";
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { AuthService } from './services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    LoginComponent,
    SidebarComponent,
    HeaderComponent,
    MobileMenuComponent,
    RouterLink,
    RouterLinkActive,
    MatProgressSpinnerModule 
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{


  title = 'arena';
  isLoading = false;
  isLoggedIn = false;
  constructor(public authService: AuthService,private themeService: ThemeService) {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.isLoading = false;
    });
  }
  ngOnInit(): void {
  }

}
