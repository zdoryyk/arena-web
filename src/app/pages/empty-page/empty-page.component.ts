import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

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
      // let token = this.authService.getToken();
      // console.log(123);
      // if (!token) {
      //   this.router.navigate(['/login']);
      //   return;
      // }
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
