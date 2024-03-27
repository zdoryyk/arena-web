import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserData } from '../../../interfaces/user';

@Component({
  selector: 'app-problemests-detail',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './problemests-detail.component.html',
  styleUrl: './problemests-detail.component.scss'
})
export class ProblemestsDetailComponent implements OnInit {


  user: UserData;

  constructor(private authService: AuthService){}

  async ngOnInit(){
    await this.loadUserData();
  }


  private async loadUserData() {
    this.user = await this.authService.checkIsUserInStorage();
    console.log('user, ', this.user);
  }
}
