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
            // Only add the "-" line if originLine is not empty
            if (originLine) {
                diff += `- ${originLine}\n`;
            }

            let compareLine = '';
            let isDifferenceMarked = false; // Indicator for any difference marked

            // Calculate differences for "^" markings
            const minLength = Math.min(originLine.length, expectedLine.length);
            for (let j = 0; j < minLength; j++) {
                if (originLine[j] !== expectedLine[j]) {
                    compareLine += '^';
                    isDifferenceMarked = true;
                } else {
                    compareLine += ' ';
                }
            }
            if (originLine.length !== expectedLine.length) {
                compareLine += '^'.repeat(Math.abs(originLine.length - expectedLine.length));
                isDifferenceMarked = true;
            }

            // Only add the compare line if there are differences marked
            // and both originLine and expectedLine are not empty
            if (isDifferenceMarked && originLine && expectedLine) {
                diff += `? ${compareLine}\n`;
            }

            // Only add the "+" line if expectedLine is not empty
            if (expectedLine) {
                diff += `+ ${expectedLine}\n`;
            }
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
