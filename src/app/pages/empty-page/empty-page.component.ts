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
    let token = this.authService.getToken();
    if(!token){
      this.router.navigate(['/login']);
      return;
    }
    let user = await this.authService.checkIsUserInStorage();
    if(user.attributes['is-lecturer']){
      this.router.navigate(['/admin-dashboard']);
      return;
    }
    this.router.navigate(['/dashboard']);
  }
  
}
