import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {HeaderComponent} from "./components/header/header.component";
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {TranslateModule } from '@ngx-translate/core';
import { AuthService } from './pages/login/auth.service';

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
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent{
  title = 'arena';
  isLoading = false;
  isLoggedIn = false;

  constructor(public authService: AuthService) {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.isLoading = false;
    });
  }
}
