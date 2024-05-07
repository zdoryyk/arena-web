import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './summary-cards.component.html',
  styleUrl: './summary-cards.component.scss'
})
export class SummaryCardsComponent {
  
  @Input() coursesLength: number = 0;
  @Input() totalSubmissions: number = 0;
  @Input() totalGroups: number = 0;

}
