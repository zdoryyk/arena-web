import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-problemset-detail',
  standalone: true,
  imports: [RouterModule, ChartModule],
  templateUrl: './problemset-detail.component.html',
  styleUrl: './problemset-detail.component.css',
})
export class ProblemsetDetailComponent implements OnInit {
  barData: any;

  barOptions: any;
  barPlugins: any;
  ngOnInit(): void {
    this.barData = {
      labels: [1, 2, 3, 4, 5, 6, 7],
      datasets: [
        {
          label: '',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: '#D8E4EC',
          barPercentage: 0.6,
        },
      ],
    };

    this.barOptions = {
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          labels: {
            title: {
              color: '#000',
              font: {
                weight: 'bold',
                size: 18,
              },
            },
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      layout: {
        padding: 20,
      },
      scales: {
        y: {
          ticks: {
            callback: function () {
              return '';
            },
          },
          grid: {
            display: false,
            drawOnChartArea: false,
          },
          border: {
            display: false,
          },
        },
        x: {
          ticks: {
            callback: function () {
              return '';
            },
          },
          grid: {
            display: false,
            drawOnChartArea: false,
          },
          border: {
            color: '#000',
          },
        },
      },
    };
    this.barPlugins = [ChartDataLabels];
  }
}
