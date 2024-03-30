import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-test-case',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './test-case.component.html',
  styleUrl: './test-case.component.scss',
})
export class TestCaseComponent implements OnInit {
  @ViewChild('contentDiv', { static: false }) contentDiv: ElementRef;
  @Input() orderedNumber: number;
  @Input() completed: number;
  @Input() assessment: number;
  @Input() text: string;
  @Input() isProcessing: boolean;
  @Input() isError: boolean;

  checkBtnVisible: boolean = false;
  closeBtnVisible: boolean = false;
  minusBtnVisible: boolean = false;
  contentHeight: string = '0px';
  rotationAngle: number = 0;
  viewHeight: number;
  showProgress: boolean = false;
  isVisible: string = '';
  isCompetedVisible: string = '';
  bgColor: string;
  @Output() dataToParent = new EventEmitter<string>();

  

  onToggle(): void {
    this.contentHeight = this.contentDiv.nativeElement.offsetHeight + 'px';

    this.rotationAngle += 90;

    if (this.rotationAngle === 180) {
      this.rotationAngle = 0;
      this.contentHeight = '0px';
    }
  }

  ngOnInit(): void {
    if (this.isProcessing) {
      if (this.isError) {
        this.minusBtnVisible = true;
        this.bgColor = 'red';
        return;
      }
      this.isVisible = 'visible';
      if (this.completed === this.assessment) {
        this.bgColor = 'green';
        this.isCompetedVisible = 'hidden';
        this.checkBtnVisible = true;
      } else {
        this.closeBtnVisible = true;
        this.bgColor = 'orange';
      }
    } else {
      this.minusBtnVisible = true;
    }
  }
}
