import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-empty-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './empty-page.component.html',
  styleUrl: './empty-page.component.scss'
})
export class EmptyPageComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ){}

  async ngOnInit() {
    try {
      let user = await this.authService.checkIsUserInStorage();
      if (user && user.attributes['is-lecturer']) {
        this.router.navigate(['/admin-dashboard']);
      } else if(user) {
        this.router.navigate(['/dashboard']);
      }else{
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error during initialization:', error);
      this.router.navigate(['/login']);
    }
  }


}
