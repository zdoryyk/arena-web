import { Component, Input } from '@angular/core';
// import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestCase } from '../../interfaces/interfaces';

@Component({
  selector: 'app-test-case',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-case.component.html',
  styleUrl: './test-case.component.css',
})
export class TestCaseComponent implements TestCase {
  @Input() id: number;
  @Input() quantity: number;
  @Input() bgColor: string;
  @Input() text: string;
}
