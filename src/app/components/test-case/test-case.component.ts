import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
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
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';


@Component({
  selector: 'app-test-case',
  standalone: true,
  imports: [CommonModule,MatIconModule,StdoutComponent,StderrComponent,MatIconModule,MatTooltipModule],
  templateUrl: './test-case.component.html',
  styleUrl: './test-case.component.scss',
})
export class TestCaseComponent implements OnInit {

  safeHtml: SafeHtml;
  @ViewChild('contentDiv', { static: false }) contentDiv: ElementRef;
  @Input() orderedNumber: number;
  @Input() submission: Submission | any;
  @Input() submissionList: Submission[];
  @Input() isRecursive: boolean;
  @Input() scale: number;
  @Output() dataToParent = new EventEmitter<string>();
  @Output() contentHeightChanged: EventEmitter<void> = new EventEmitter();

  isExpanded: boolean = false;
  checkBtnVisible: boolean = false;
  closeBtnVisible: boolean = false;
  minusBtnVisible: boolean = false;
  contentHeight: string = '0px';
  rotationAngle: number = 0;
  viewHeight: number;
  isVisible: string = '';
  isCompletedVisible: string = '';
  bgColor: string;
  parsedDescription = '';
  title: string;
  score: number;
  maxScore: number;
  passed: boolean;
  strict: boolean;
  
  constructor
  (
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private matIconRegistery: MatIconRegistry,
   ){
    this.matIconRegistery.addSvgIcon(
      'timer',
      this.sanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/timer.svg'),
    );
    this.matIconRegistery.addSvgIcon(
      'return',
      this.sanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/return-code.svg'),
    );
    this.matIconRegistery.addSvgIcon(
      'info',
      this.sanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/info.svg'),
    );
   }
  
  ngOnInit(): void {
    if(!this.isRecursive){
      this.sortSubmission();
      return;
    }
    this.title = this.submission.title;
    this.score = this.submission.score;
    this.maxScore = this.submission.maxScore;
    this.passed = this.submission.isPassed;
    this.strict = this.submission.isStrict;
    const isError = this.checkIsError();
    this.setAttributes(isError);
  }


  sortSubmission(){
    const { passed, strict, document } = this.submission.attributes;
    const { score, 'max-score': maxScore, description } = document;
    this.title = this.submission.attributes.title;
    this.score = score;
    this.maxScore = maxScore;
    this.passed = passed;
    this.strict = strict;
    const isError = this.checkIsError();
    if (description) {
      this.parsedDescription = this.parseDescription(description);
    }
    this.setAttributes(isError);
  }

  setAttributes(isError: boolean){
    if (!this.strict) {
      this.isVisible = 'visible';
      if (this.passed && this.score != null && this.maxScore != null) {
        this.bgColor = 'green';
        this.isCompletedVisible = 'visible';
        this.checkBtnVisible = true;
      } else if(!this.passed && this.score != null && this.maxScore != null) {
        this.closeBtnVisible = true;
        this.bgColor = 'orange';
      }
      else{
        this.isVisible = '';
        this.minusBtnVisible = true;
      }
    } else if(this.strict){
      if (isError) {
        this.minusBtnVisible = true;
        this.bgColor = 'red';
        return;
      }
      else if(this.passed && this.score != null && this.maxScore != null){
        this.isVisible = 'visible';
        this.bgColor = 'green';
        this.isCompletedVisible = 'visible';
        this.checkBtnVisible = true;
      }
      else if(!this.passed && this.score != null && this.maxScore != null) {
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
  

  onToggle(): void {
    this.contentHeight = this.contentDiv.nativeElement.offsetHeight + 'px';
    this.rotationAngle += 90;
    if (this.rotationAngle === 180) {
      this.rotationAngle = 0;
      this.contentHeight = '0px';
    }
      this.contentHeightChanged.emit();
   }



  handleDisplayTextChange() {
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.updateContentSize();
    },400);
    
  }

  updateContentSize() {
    this.contentHeight = this.contentDiv.nativeElement.offsetHeight + 'px';
  }

  parseDescription(description: string): string {
    description = description.replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
                .replace(/\_([^\_]+)\_/g, '<em>$1</em>') 
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a style="color: #8FBE48;text-decoration: none"  href="$2">$1</a>');
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(description);
    return description;
  }

  checkIsError():boolean{
    return this.strict
     && this.score == null
     && this.maxScore == null 
     && !this.passed;
  }


  nextScale(): any {
    return this.scale == 0.2 ? 0.2 : this.scale - 0.2;
  }

}


