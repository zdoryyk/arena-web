import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-stdout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stdout.component.html',
  styleUrl: './stdout.component.scss'
})
export class StdoutComponent implements OnInit {
  isExpectedPresent = false;
  @Input() originStdout: string;
  @Input() expectedStdout: string;
  @Output() displayTextChanged = new EventEmitter<string>(); 

  displayText: string = '';
  diffBetweenStdouts: string = '';
  activeButton: string = 'produced';

  ngOnInit(): void {
    if (!!this.expectedStdout) {
      this.findDiffBetweenStdouts();
      this.isExpectedPresent = true;
      return;
    }
    this.displayText = this.originStdout;
  }

  findDiffBetweenStdouts() {
    const originLines = this.originStdout.split('\n');
    const expectedLines = this.expectedStdout.split('\n');
    let diff = '';
  
    const maxLength = Math.max(originLines.length, expectedLines.length);
  
    for (let i = 0; i < maxLength; i++) {
      const originLine = originLines[i] || '';
      const expectedLine = expectedLines[i] || '';
  
      if (originLine !== expectedLine) {
        
        diff += `- ${originLine}\n`;
  
        
        let compareLine = '? ';
  
        
        const minLength = Math.min(originLine.length, expectedLine.length);
        for (let j = 0; j < minLength; j++) {
          compareLine += originLine[j] !== expectedLine[j] ? '^' : ' ';
        }
        if (originLine.length > expectedLine.length) {
          compareLine += '^'.repeat(originLine.length - expectedLine.length);
        }
        diff += `${compareLine}\n`;
        diff += `+ ${expectedLine}\n`;
      } else {
        diff += `  ${originLine}\n`;
      }
    }
    this.diffBetweenStdouts = diff;
    this.displayText = this.diffBetweenStdouts;
    this.activeButton = 'diff';
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
    this.displayTextChanged.emit();
  }
}
