import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Submission } from '../../interfaces/interfaces';

@Component({
  selector: 'app-test-case-suite',
  standalone: true,
  imports: [],
  templateUrl: './test-case-suite.component.html',
  styleUrl: './test-case-suite.component.scss'
})
export class TestCaseSuiteComponent {
  safeHtml: SafeHtml;
  @ViewChild('contentDiv', { static: false }) contentDiv: ElementRef;
  @Input() orderedNumber: number;
  @Input() submission: Submission | any;
  @Input() submissionList: Submission[];
  @Input() isRecursive: boolean;
  @Input() scale: number;
  @Output() dataToParent = new EventEmitter<string>();
  @Output() resizeEvent: EventEmitter<void> = new EventEmitter<void>();


  constructor(private cdRef: ChangeDetectorRef,private sanitizer: DomSanitizer){}

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
    const isError = this.checkIsError();
    // if (description) {
    //   this.parsedDescription = this.parseDescription(description);
    // }
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

  onSizeChanged(newSize: number) {
    this.contentHeight = newSize + 'px';
    this.cdRef.detectChanges();
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
