import {
  ChangeDetectorRef,
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
import { StdoutComponent } from '../test-case-components/stdout/stdout.component';
import { StderrComponent } from '../test-case-components/stderr/stderr.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-test-case',
  standalone: true,
  imports: [CommonModule,MatIconModule,StdoutComponent,StderrComponent],
  templateUrl: './test-case.component.html',
  styleUrl: './test-case.component.scss',
})
export class TestCaseComponent implements OnInit {

  safeHtml: SafeHtml;
  @ViewChild('contentDiv', { static: false }) contentDiv: ElementRef;
  @Input() orderedNumber: number;
  @Input() completed: number;
  @Input() assessment: number;
  @Input() isProcessing: boolean;
  @Input() submission: Submission;
  @Input() isRecursive: boolean;
  @Input() scale: number;

  constructor(private cdRef: ChangeDetectorRef,private sanitizer: DomSanitizer){}

  isExpanded: boolean = false;
  checkBtnVisible: boolean = false;
  closeBtnVisible: boolean = false;
  minusBtnVisible: boolean = false;
  contentHeight: string = '0px';
  rotationAngle: number = 0;
  viewHeight: number;
  isVisible: string = '';
  isCompetedVisible: string = '';
  bgColor: string;
  parsedDescription = '';
  @Output() dataToParent = new EventEmitter<string>();

  

  onToggle(): void {
    if(!this.isRecursive){
      this.scale = 1.0;
    }
    this.contentHeight = this.contentDiv.nativeElement.offsetHeight + 'px';
    this.rotationAngle += 90;
    if (this.rotationAngle === 180) {
      this.rotationAngle = 0;
      this.contentHeight = '0px';
    }
    
  }

  handleDisplayTextChange() {
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.updateContentSize();
    });
  }

  updateContentSize() {
    this.contentHeight = this.contentDiv.nativeElement.offsetHeight + 'px';
  }

  parseDescription(description: string): string {
    description = description.replace(/`([^`]+)`/g, '<code>$1</code>');
    description = description.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    description = description.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    description = description.replace(/\_([^\_]+)\_/g, '<em>$1</em>'); 
    description = description.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a style="color: #8FBE48;text-decoration: none"  href="$2">$1</a>');
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(description);
    return description;
  }


  ngOnInit(): void {
    if(this.submission.attributes.type === 'suite'){
      console.log('suite');
    }
    const { passed, strict, document } = this.submission.attributes;
    const { score, 'max-score': maxScore, description } = document;
    const isError = this.checkIsError();

    if (description) {
      this.parsedDescription = this.parseDescription(description);
    }
    if (!strict) {
      this.isVisible = 'visible';
      if (passed && score != null && maxScore != null) {
        this.bgColor = 'green';
        this.isCompetedVisible = 'visible';
        this.checkBtnVisible = true;
      } else if(!passed && score != null && maxScore != null) {
        this.closeBtnVisible = true;
        this.bgColor = 'orange';
      }
      else{
        this.isVisible = '';
        this.minusBtnVisible = true;
      }
    } else if(strict){
      if (isError) {
        this.minusBtnVisible = true;
        this.bgColor = 'red';
        return;
      }
      else if(passed && score != null && maxScore != null){
        this.isVisible = 'visible';
        this.bgColor = 'green';
        this.isCompetedVisible = 'visible';
        this.checkBtnVisible = true;
      }
      else if(!passed && score != null && maxScore != null) {
        this.isVisible = 'visible';
        this.closeBtnVisible = true;
        this.bgColor = 'orange';
      }
      else{
        this.isVisible = '';
        this.minusBtnVisible = true;
      }
    }
  }

  checkIsError():boolean{
    return this.submission.attributes.document.strict
     && this.submission.attributes.document.score == null
     && this.submission.attributes.document['max-score'] == null 
     && !this.submission.attributes.passed;
  }


  nextScale(): any {
    if(this.scale == 0.2){
      return 0.2;
    }
    return this.scale - 0.2;  
  }
    
}


