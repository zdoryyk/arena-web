import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [MatIconModule,TranslateModule],
  templateUrl: './summary-cards.component.html',
  styleUrl: './summary-cards.component.scss'
})
export class SummaryCardsComponent {
  
  @Input() coursesLength: number = 0;
  @Input() totalSubmissions: number = 0;
  @Input() totalGroups: number = 0;

  constructor(private translate: TranslateService){
    this.translate.addLangs(['en', 'sk']);
    this.translate.setDefaultLang('sk');
  }

}
