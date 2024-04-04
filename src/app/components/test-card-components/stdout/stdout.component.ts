import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-stdout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stdout.component.html',
  styleUrl: './stdout.component.scss'
})
export class StdoutComponent implements OnInit{

  isExpectedPresent = false;
  @Input() originStdout: string;
  @Input() expectedStdout: string;
  displayText: string = '';
  diffBetweenStdouts: string;
  activeButton: string = 'produced'; 

  
  ngOnInit(): void {
    if(!!this.expectedStdout){
      this.findDiffBetweenStdouts();
      this.isExpectedPresent = true;
    }
    this.setDisplayText('produced');
  }
  findDiffBetweenStdouts(){
    console.log('diff');
  }


  setDisplayText(type: string) {
    this.activeButton = type;
    switch (type) {
      case 'produced':
        this.displayText = this.originStdout;
        break;
      case 'expected':
        this.displayText = this.expectedStdout;
        break;
      case 'diff':
        this.displayText = this.diffBetweenStdouts;
        break;
      default:
        this.displayText = '';
    }
  }

 



}
