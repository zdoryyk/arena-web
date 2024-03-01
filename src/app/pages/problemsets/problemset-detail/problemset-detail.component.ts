import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TestGroupComponent } from '../../../components/test-group/test-group.component';
import { TestCaseComponent } from '../../../components/test-case/test-case.component';

@Component({
  selector: 'app-problemset-detail',
  standalone: true,
  imports: [RouterModule, ChartModule, TestGroupComponent, TestCaseComponent],
  templateUrl: './problemset-detail.component.html',
  styleUrl: './problemset-detail.component.css',
})
export class ProblemsetDetailComponent implements OnInit {
  // testCaseData = [
  //   {
  //     id: 1,
  //     quantity: null,
  //     bgColor: null,
  //     text: 'text',
  //   },
  //   {
  //     id: 2,
  //     quantity: 0,
  //     bgColor: 'green',
  //     text: 'text',
  //   },
  //   {
  //     id: 3,
  //     quantity: 0,
  //     bgColor: 'green',
  //     text: 'text',
  //   },
  //   {
  //     id: 4,
  //     quantity: 0,
  //     bgColor: 'orange',
  //     text: 'text',
  //   },
  // ];

  testCaseData = [
    {
      id: 1,
      title: 'Weapon',
      cases: [
        { id: 1, quantity: null, bgColor: null, text: 'text' },
        {
          id: 2,
          quantity: 0,
          bgColor: 'green',
          text: 'text',
        },
        {
          id: 3,
          quantity: 0,
          bgColor: 'green',
          text: 'text',
        },
        {
          id: 4,
          quantity: 0,
          bgColor: 'orange',
          text: 'text',
        },
      ],
    },
    {
      id: 2,
      title: 'Action',
      cases: [
        { id: 1, quantity: null, bgColor: 'orange', text: 'text' },
        {
          id: 2,
          quantity: 0,
          bgColor: 'green',
          text: 'text',
        },
        {
          id: 3,
          quantity: 0,
          bgColor: 'green',
          text: 'text',
        },
      ],
    },
  ];

  barData: any;
  barOptions: any;
  barPlugins: any;

  ngOnInit(): void {
    this.barData = {
      labels: [1, 2, 3, 4, 5, 6, 7],
      datasets: [
        {
          label: '',
          data: [65, 59, 79, 41, 56, 55, 40],
          barPercentage: 0.6,
          backgroundColor: (color: any) => {
            const highestIndex = this.barData.datasets[0].data.indexOf(
              Math.max(...this.barData.datasets[0].data)
            );
            return color.index === highestIndex ? '#88C4E4' : '#D8E4EC';
          },
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
        padding: 30,
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
