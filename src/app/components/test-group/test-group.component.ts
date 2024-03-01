import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-group.component.html',
  styleUrl: './test-group.component.css',
})
export class TestGroupComponent {
  @Input() title: string;
}
