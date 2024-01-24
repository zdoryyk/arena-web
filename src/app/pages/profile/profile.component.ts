import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ChartModule,AvatarModule,AvatarGroupModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  basicData: any;

  basicOptions: any;

  
}
