import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stderr',
  standalone: true,
  imports: [],
  templateUrl: './stderr.component.html',
  styleUrl: './stderr.component.scss'
})
export class StderrComponent {

  @Input() originStderr: string;

}
