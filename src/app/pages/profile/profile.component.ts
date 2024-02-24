import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { plugins } from 'chart.js';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, AvatarGroupModule, ChartModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  basicData: any;

  basicOptions: any;

  ngOnInit(): void {
    this.basicData = {
      labels: ['1', '2', '3', '4', '5', '6'],
      datasets: [
        {
          label: 'Problemset last',
          data: [10, 40, 90, 50, 100, 120],
          backgroundColor: '#6e37ed',
        },
        {
          label: 'Problemset first',
          data: [50, 30, 40, 85, 110, 90],
          backgroundColor: '#ed6868',
        },
      ],
    };
    this.basicOptions = {
      scales: {
        y: {
          ticks: {
            callback: function () {
              return '';
            },
          },
        },
        x: {
          ticks: {
            callback: function () {
              return '';
            },
          },
        },
      },
    };
  }
}
