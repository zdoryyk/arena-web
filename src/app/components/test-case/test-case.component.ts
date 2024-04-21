import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StdoutComponent } from './test-case-components/stdout/stdout.component';
import { StderrComponent } from './test-case-components/stderr/stderr.component';
import { NestedTask } from '../../interfaces/submission';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-test-case-test',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatExpansionModule,
    StdoutComponent,
    StderrComponent,
    MatTooltipModule
  ],
  animations:[],
  templateUrl: './test-case.component.html',
  styleUrl: './test-case.component.scss'
})
export class TestCaseComponent implements OnInit {


  isMobile = false;
  safeHtml: SafeHtml;
  @Input() orderedNumber: number;
  @Input() submission: NestedTask;
  @Input() scale: number;
  
  
  isRecursive: boolean;
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
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth <= 568){
      this.isMobile = true;
    }else{
      this.isMobile = false;
    }
  }


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

    if(this.submission.children && this.submission.children.length != 0){
      console.log(this.submission.attributes.title + ' ' + 'recursive');
      this.isRecursive = true;
    }

    if(window.innerWidth <= 568){
      this.isMobile = true;
    }
    if(!this.isRecursive){
      this.sortSubmission();
      return;
    }
    this.title = this.submission.attributes.title;
    this.score = this.submission.attributes.document.score;
    this.maxScore = this.submission.attributes.document['max-score'];
    this.passed = this.submission.attributes.document.passed;
    this.strict = this.submission.attributes.document.strict;
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
    // console.log(` ${this.title} ${this.score}  ${this.maxScore} ${this.passed}  ${this.strict} ${this.submission.children.length}`);
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
        this.bgColor = 'red';
        if(this.score == null){
          this.minusBtnVisible = true;
          return;
        }
        this.isVisible = 'visible';
        this.isCompletedVisible = 'visible';
        this.closeBtnVisible = true;
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
    this.rotationAngle += 90;
    if (this.rotationAngle === 180) {
      this.rotationAngle = 0;
      this.contentHeight = '0px';
    }
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
    return (
      this.strict
     && this.score == null
     && this.maxScore == null 
     && !this.passed
     ) 
     || 
     (
      this.strict
      && this.score == 0
      && this.maxScore != null
      && !this.passed
    );
  }


  nextScale(): any {
    return this.scale == 0.2 ? 0.2 : this.scale - 0.2;
  }


}
