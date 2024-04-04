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
import { Submission } from '../../interfaces/submission';
import { StdoutComponent } from '../test-card-components/stdout/stdout.component';
import { StderrComponent } from '../test-card-components/stderr/stderr.component';

@Component({
  selector: 'app-test-case',
  standalone: true,
  imports: [CommonModule,MatIconModule,StdoutComponent,StderrComponent],
  templateUrl: './test-case.component.html',
  styleUrl: './test-case.component.scss',
})
export class TestCaseComponent implements OnInit {
  @ViewChild('contentDiv', { static: false }) contentDiv: ElementRef;
  @Input() orderedNumber: number;
  @Input() completed: number;
  @Input() assessment: number;
  @Input() isProcessing: boolean;
  @Input() submission: Submission;


  isExpanded: boolean = false;
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
    
    let passed = this.submission.attributes.passed;
    let isError  = this.submission.attributes.document.result['return-code'] == 2;
    if (!this.submission.attributes.strict) {
      this.isVisible = 'visible';
      if (passed) {
        this.bgColor = 'green';
        this.isCompetedVisible = 'visible';
        this.checkBtnVisible = true;
      } else {
        this.closeBtnVisible = true;
        this.bgColor = 'orange';
      }
    } else {
      if (isError) {
        this.minusBtnVisible = true;
        this.bgColor = 'red';
        return;
      }
      this.minusBtnVisible = true;
    }
  }

}


