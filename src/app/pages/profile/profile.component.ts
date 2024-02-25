import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

const doughnutLabel = {
  id: 'doughnutLabel',
  beforeDatasetsDraw(chart, args, pluginOptions) {
    const { ctx, data } = chart;
    const labelEnd = chart.id === 1 ? '' : '%';
    const textColor = chart.id === 1 ? '#C391C8' : '#7F8EC6';

    ctx.save();
    const xCoor = chart.getDatasetMeta(0).data[0].x;
    const yCoor = chart.getDatasetMeta(0).data[0].y;
    ctx.textAlign = 'center';
    ctx.font = 'bold 60px sans-serif';
    ctx.fillStyle = textColor;
    ctx.fillText(`${data.datasets[0].data[0]}${labelEnd}`, xCoor, yCoor);
  },
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, AvatarGroupModule, ChartModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  leftDoughnutData: any;
  rightDoughnutData: any;
  doughnutOptions: any;
  rightDoughnutOptions: any;
  plugins: any;

  ngOnInit(): void {
    this.leftDoughnutData = {
      labels: ['Last Submission'],
      datasets: [
        {
          data: [42, 74], // [max: 100, 116 - [1]]
          backgroundColor: ['#A9BEF4', 'transparent'],
          cutout: 115,
          borderWidth: 0,
          borderRadius: [8, 0],
          spacing: -45,
        },
        {
          data: [100],
          backgroundColor: 'transparent',
          cutout: 115,
          borderWidth: 10,
          borderColor: 'rgba(231, 196, 242, 0.4)',
        },
      ],
    };
    this.doughnutOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 13,
            boxHeight: 13,
            color: '#303030',
            font: {
              size: 25,
            },
          },
          position: 'bottom',
        },
        tooltip: {
          enabled: false,
        },
      },
    };

    this.rightDoughnutData = {
      labels: ['Earned points'],
      datasets: [
        {
          data: [332, 684], // [max: 100, 1016 - [1]]
          backgroundColor: ['#cf93cd', 'transparent'],
          cutout: 115,
          borderWidth: 0,
          borderRadius: [8, 0],
          spacing: -45,
        },
        {
          data: [100],
          backgroundColor: 'transparent',
          cutout: 115,
          borderWidth: 10,
          borderColor: 'rgba(231, 196, 242, 0.4)',
        },
      ],
    };

    this.plugins = [doughnutLabel];
  }
}
